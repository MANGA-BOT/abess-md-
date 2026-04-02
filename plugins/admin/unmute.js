const fs = require("fs")

module.exports = {
    name: "unmute",
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

        // ===== 🔥 LIST =====
        if (args[0] === "list") {

            const users = Object.keys(data[from])

            if (users.length === 0) {
                return sock.sendMessage(from, {
                    text: "📭 Aucun membre mute"
                }, { quoted: msg })
            }

            const text = users.map(u => "@" + u.split("@")[0]).join("\n")

            return sock.sendMessage(from, {
                text: `🔇 Liste mute :\n${text}`,
                mentions: users
            }, { quoted: msg })
        }

        // ===== 🔥 UNMUTE ALL =====
        if (args[0] === "all") {

            data[from] = {}

            fs.writeFileSync(file, JSON.stringify(data, null, 2))

            return sock.sendMessage(from, {
                text: "🔊 Groupe unmute"
            }, { quoted: msg })
        }

        // ===== 🔥 UNMUTE ADMIN =====
        if (args[0] === "admin") {

            const metadata = await sock.groupMetadata(from)

            const admins = metadata.participants
                .filter(p => p.admin !== null)
                .map(p => p.id)

            admins.forEach(a => {
                delete data[from][a]
            })

            fs.writeFileSync(file, JSON.stringify(data, null, 2))

            return sock.sendMessage(from, {
                text: "🔊 Admins unmute"
            }, { quoted: msg })
        }

        // ===== 🔥 USER NORMAL =====
        let user

        const mentioned =
            msg.message?.extendedTextMessage?.contextInfo?.mentionedJid

        if (mentioned && mentioned.length > 0) {
            user = mentioned[0]
        }

        else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
            user = msg.message.extendedTextMessage.contextInfo.participant
        }

        else if (args[0]) {
            user = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net"
        }

        if (!user) {
            return sock.sendMessage(from, {
                text: "❌ Mentionne, reply ou numéro"
            }, { quoted: msg })
        }

        // ===== 🔥 DELETE USER =====
        delete data[from][user]

        fs.writeFileSync(file, JSON.stringify(data, null, 2))

        await sock.sendMessage(from, {
            text: `🔊 @${user.split("@")[0]} unmute`,
            mentions: [user]
        }, { quoted: msg })
    }
}