const fs = require("fs")

module.exports = {
    name: "prefix",
    ownerOnly: true,

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const file = "./database/prefix.json"

        let data = { prefix: "." }

        try {
            if (fs.existsSync(file)) {
                data = JSON.parse(fs.readFileSync(file))
            }
        } catch {}

        const newPrefix = args[0]

        if (!newPrefix) {
            return sock.sendMessage(from, {
                text: `🔧 Prefix actuel : ${data.prefix}`
            }, { quoted: msg })
        }

        data.prefix = newPrefix

        fs.writeFileSync(file, JSON.stringify(data, null, 2))

        await sock.sendMessage(from, {
            text: `✅ Nouveau prefix : ${newPrefix}`
        }, { quoted: msg })
    }
}