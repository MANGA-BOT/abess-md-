// commands/goodbye.js
const fs = require("fs")

module.exports = {
    name: "goodbye",
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
                text: `⚙️ Usage: .goodbye on/off`
            }, { quoted: msg })
        }

        if (args[0] === "on") {
            data.goodbye[from] = true
        }

        if (args[0] === "off") {
            delete data.goodbye[from]
        }

        fs.writeFileSync(file, JSON.stringify(data, null, 2))

        await sock.sendMessage(from, {
            text: `👋 Goodbye ${args[0] === "on" ? "activé" : "désactivé"}`
        }, { quoted: msg })
    }
}