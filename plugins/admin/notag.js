const fs = require("fs")

module.exports = {
    name: "notag",
    groupOnly: true,
    adminOnly: true,

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const file = "./database/notag.json"

        let data = {}

        if (fs.existsSync(file)) {
            data = JSON.parse(fs.readFileSync(file))
        }

        if (!data[from]) {
            data[from] = {
                users: [],
                whitelist: [],
                ghost: false
            }
        }

        const group = data[from]

        const mentioned =
            msg.message?.extendedTextMessage?.contextInfo?.mentionedJid

        const action = args[0]

        // ===== ADD USER =====
        if (action === "add" && mentioned) {
            const user = mentioned[0]

            if (!group.users.includes(user)) {
                group.users.push(user)
            }

            fs.writeFileSync(file, JSON.stringify(data, null, 2))

            return sock.sendMessage(from, {
                text: `🔒 @${user.split("@")[0]} protégé`,
                mentions: [user]
            }, { quoted: msg })
        }

        // ===== REMOVE USER =====
        if (action === "remove" && mentioned) {
            const user = mentioned[0]

            group.users = group.users.filter(u => u !== user)

            fs.writeFileSync(file, JSON.stringify(data, null, 2))

            return sock.sendMessage(from, {
                text: `🔓 @${user.split("@")[0]} libéré`,
                mentions: [user]
            }, { quoted: msg })
        }

        // ===== WHITELIST =====
        if (action === "wl" && mentioned) {
            const user = mentioned[0]

            if (!group.whitelist.includes(user)) {
                group.whitelist.push(user)
            }

            fs.writeFileSync(file, JSON.stringify(data, null, 2))

            return sock.sendMessage(from, {
                text: `⭐ @${user.split("@")[0]} autorisé`,
                mentions: [user]
            }, { quoted: msg })
        }

        // ===== GHOST MODE =====
        if (action === "ghost") {
            group.ghost = !group.ghost

            fs.writeFileSync(file, JSON.stringify(data, null, 2))

            return sock.sendMessage(from, {
                text: `👻 Ghost mode: ${group.ghost ? "ON" : "OFF"}`
            }, { quoted: msg })
        }
    }
}