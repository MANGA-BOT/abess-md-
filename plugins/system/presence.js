const fs = require("fs")

module.exports = {
    name: "presence",
    ownerOnly: true,

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid
        const file = "./database/settings.json"

        let data = {
            presence: "smart"
        }

        if (fs.existsSync(file)) {
            data = JSON.parse(fs.readFileSync(file))
        }

        const mode = args[0]

        const modes = ["smart", "typing", "recording", "off"]

        if (!modes.includes(mode)) {
            return sock.sendMessage(from, {
                text:
                    "❌ 𝑴𝒐𝒅𝒆𝒔:\n" +
                    "𝑺𝒎𝒂𝒓𝒕\n" +
                    "𝑻𝒚𝒑𝒊𝒏𝒈\n" +
                    "𝑹𝒆𝒄𝒐𝒓𝒅𝒊𝒏𝒈\n" +
                    "𝑶𝒇𝒇"
            }, { quoted: msg })
        }

        data.presence = mode
        fs.writeFileSync(file, JSON.stringify(data, null, 2))

        await sock.sendMessage(from, {
            text: `🤖 𝑷𝒓𝒆𝒔𝒆𝒏𝒄𝒆 𝒎𝒐𝒅𝒆 : ${mode}
            > 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`
        }, { quoted: msg })
    }
}