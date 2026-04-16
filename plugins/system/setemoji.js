const fs = require("fs")

module.exports = {
    name: "setemoji",
    ownerOnly: true,

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid
        const file = "./database/settings.json"

        let data = {}

        if (fs.existsSync(file)) {
            data = JSON.parse(fs.readFileSync(file))
        }

        const emoji = args[0]

        if (!emoji) {
            return sock.sendMessage(from, {
                text: "❌ 𝑬𝒙𝒆𝒎𝒑𝒍𝒆: .𝑠𝑒𝑡𝑒𝑚𝑜𝑗𝑖 ❤️"
            }, { quoted: msg })
        }

        data.statusEmoji = emoji

        fs.writeFileSync(file, JSON.stringify(data, null, 2))

        await sock.sendMessage(from, {
            text: `😊 𝑬𝒎𝒐𝒋𝒊 𝒔𝒕𝒂𝒕𝒖𝒔 𝒄𝒉𝒂𝒏𝒈𝒆𝒓. : ${emoji}
            > 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫
`
        }, { quoted: msg })
    }
}