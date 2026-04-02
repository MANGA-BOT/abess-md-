const fs = require("fs")

module.exports = {
    name: "mute",
    groupOnly: true,
    adminOnly: true,

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid
        const file = "./database/muted.json"

        let data = {}
        if (fs.existsSync(file)) {
            data = JSON.parse(fs.readFileSync(file))
        }

        if (!data[from]) data[from] = {}

        const metadata = await sock.groupMetadata(from)

        // ===== 🔥 HELP =====
        if (!args[0]) {
            return sock.sendMessage(from, {
                text:
`╭━━━〔 🕷𝑴𝑼𝑻𝑬 𝑷𝑨𝑵𝑬𝑳🕷 〕━━━⬣
┃ 🕷 .mute @user 5m
┃ 🕷 .mute all 5m
┃ 🕷 .mute admin 5m
┃ 🕷 .mute off @user
┃ 🕷 .mute list
╰━━━━━━━━━━━━━━⬣`
            }, { quoted: msg })
        }

        // ===== 🔥 LIST =====
        if (args[0] === "list") {
            const list = data[from]

            if (!list || Object.keys(list).length === 0) {
                return sock.sendMessage(from, {
                    text: "📭 Aucun utilisateur mute"
                }, { quoted: msg })
            }

            let txt = "🔇 Liste des mutés :\n\n"

            for (let user in list) {
                const left = Math.max(0, list[user] - Date.now())
                const min = Math.floor(left / 60000)
                txt += `➤ @${user.split("@")[0]} (${min}m)\n`
            }

            return sock.sendMessage(from, {
                text: txt,
                mentions: Object.keys(list)
            }, { quoted: msg })
        }

        // ===== 🔥 UNMUTE =====
        if (args[0] === "off") {
            let user = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

            if (!user) {
                return sock.sendMessage(from, {
                    text: "❌ Mentionne la personne à unmute"
                }, { quoted: msg })
            }

            if (!data[from][user]) {
                return sock.sendMessage(from, {
                    text: "⚠️ Cet utilisateur n'est pas mute"
                }, { quoted: msg })
            }

            delete data[from][user]
            fs.writeFileSync(file, JSON.stringify(data, null, 2))

            return sock.sendMessage(from, {
                text: `🔊 @${user.split("@")[0]} unmute avec succès`,
                mentions: [user]
            }, { quoted: msg })
        }

        // ===== 🔥 DURATION =====
        let duration = args[1] || "5m"
        let ms = 0

        if (duration.endsWith("s")) ms = parseInt(duration) * 1000
        else if (duration.endsWith("m")) ms = parseInt(duration) * 60000
        else if (duration.endsWith("h")) ms = parseInt(duration) * 3600000
        else if (duration.endsWith("d")) ms = parseInt(duration) * 86400000
        else {
            return sock.sendMessage(from, {
                text: "❌ Format invalide (ex: 10s, 5m, 2h, 1d)"
            }, { quoted: msg })
        }

        const expire = Date.now() + ms

        // ===== 🔥 MUTE ALL =====
        if (args[0] === "all") {
            metadata.participants.forEach(p => {
                if (!p.admin) data[from][p.id] = expire
            })

            fs.writeFileSync(file, JSON.stringify(data, null, 2))

            return sock.sendMessage(from, {
                text: `🔇 Groupe mute (${duration})`
            }, { quoted: msg })
        }

        // ===== 🔥 MUTE ADMINS =====
        if (args[0] === "admin") {
            metadata.participants
                .filter(p => p.admin)
                .forEach(p => {
                    data[from][p.id] = expire
                })

            fs.writeFileSync(file, JSON.stringify(data, null, 2))

            return sock.sendMessage(from, {
                text: `🔇 Admins mute (${duration})`
            }, { quoted: msg })
        }

        // ===== 🔥 USER =====
        let user =
            msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
            msg.message?.extendedTextMessage?.contextInfo?.participant ||
            (args[0] ? args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net" : null)

        if (!user) {
            return sock.sendMessage(from, {
                text: "❌ Mentionne, reply ou mets un numéro"
            }, { quoted: msg })
        }

        // ===== 🔥 CHECK ADMIN =====
        const target = metadata.participants.find(p => p.id === user)

        if (target?.admin) {
            return sock.sendMessage(from, {
                text: "🚫 Impossible de mute un admin"
            }, { quoted: msg })
        }

        // ===== 🔥 ALREADY MUTED =====
        if (data[from][user]) {
            return sock.sendMessage(from, {
                text: `⚠️ @${user.split("@")[0]} est déjà mute`,
                mentions: [user]
            }, { quoted: msg })
        }

        // ===== 🔥 APPLY =====
        data[from][user] = expire
        fs.writeFileSync(file, JSON.stringify(data, null, 2))

        await sock.sendMessage(from, {
            text:
`🔇 𝑴𝑼𝑻𝑬 𝑨𝑪𝑻𝑰𝑽𝑬́

👤 @${user.split("@")[0]}
⏳ Durée : ${duration}`,
            mentions: [user]
        }, { quoted: msg })
    }
}