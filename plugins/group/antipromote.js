const fs = require("fs")

const FILE = "./database/antipromote.json"

module.exports = {
    name: "antipromote",
    groupOnly: true,
    adminOnly: true,

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const state = args[0]

        if (!["on", "off"].includes(state)) {
            return sock.sendMessage(from, {
                text: "❌ Exemple : .antipromote on/off"
            }, { quoted: msg })
        }

        let data = {}

        if (fs.existsSync(FILE)) {
            data = JSON.parse(fs.readFileSync(FILE))
        }

        data[from] = state === "on"

        fs.writeFileSync(FILE, JSON.stringify(data, null, 2))

        await sock.sendMessage(from, {
            text: `🛡️ AntiPromote ${state}`
        }, { quoted: msg })
    }
}