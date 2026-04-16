const fs = require("fs")

module.exports = {
    name: "lockgc",
    groupOnly: true,
    adminOnly: true,

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid
        const file = "./database/lockgc.json"

        let data = {}

        if (fs.existsSync(file)) {
            data = JSON.parse(fs.readFileSync(file))
        }

        if (!args[0]) {
            return sock.sendMessage(from, {
                text: "❌ Exemple : .lockgc on / off"
            }, { quoted: msg })
        }

        if (args[0] === "on") {
            data[from] = true

            fs.writeFileSync(file, JSON.stringify(data, null, 2))

            return sock.sendMessage(from, {
                text: "🔒 Groupe verrouillé.\nAucune modification autorisée."
            }, { quoted: msg })
        }

        if (args[0] === "off") {
            delete data[from]

            fs.writeFileSync(file, JSON.stringify(data, null, 2))

            return sock.sendMessage(from, {
                text: "🔓 Groupe déverrouillé."
            }, { quoted: msg })
        }
    }
}