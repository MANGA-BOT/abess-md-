const fs = require("fs")

module.exports = {
    name: "autostatus",
    ownerOnly: true,

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid
        const file = "./database/settings.json"

        let settings = {}

        if (fs.existsSync(file)) {
            settings = JSON.parse(fs.readFileSync(file))
        }

        if (!settings.autostatus) settings.autostatus = false

        // ===== STATUS =====
        if (!args[0]) {
            return sock.sendMessage(from, {
                text: `📡 AutoStatus: ${settings.autostatus ? "ON ✅" : "OFF ❌"}`
            }, { quoted: msg })
        }

        if (args[0] === "on") {
            settings.autostatus = true

            fs.writeFileSync(file, JSON.stringify(settings, null, 2))

            return sock.sendMessage(from, {
                text: "💚 AutoStatus activé"
            }, { quoted: msg })
        }

        if (args[0] === "off") {
            settings.autostatus = false

            fs.writeFileSync(file, JSON.stringify(settings, null, 2))

            return sock.sendMessage(from, {
                text: "❌ AutoStatus désactivé"
            }, { quoted: msg })
        }

        return sock.sendMessage(from, {
            text: "❌ Utilise : .autostatus on/off"
        }, { quoted: msg })
    }
}