// commands/welcome.js
const fs = require("fs")

module.exports = {
    name: "welcome",
    groupOnly: true,
    adminOnly: true,

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const file = "./database/welcome.json"

        let data = { welcome: {}, goodbye: {} }

        if (fs.existsSync(file)) {
            data = JSON.parse(fs.readFileSync(file))
        }

        if (!args[0]) {
            return sock.sendMessage(from, {
                text: `⚙️ Usage: .welcome on/off`
            }, { quoted: msg })
        }

        if (args[0] === "on") {
            data.welcome[from] = true
        }

        if (args[0] === "off") {
            delete data.welcome[from]
        }

        fs.writeFileSync(file, JSON.stringify(data, null, 2))

        await sock.sendMessage(from, {
            text: `👋 Welcome ${args[0] === "on" ? "activé" : "désactivé"}`
        }, { quoted: msg })
    }
}