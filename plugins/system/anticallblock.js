const fs = require("fs")

module.exports = {
    name: "anticallblock",
    ownerOnly: true,

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid
        const file = "./database/settings.json"

        let data = {}

        if (fs.existsSync(file)) {
            data = JSON.parse(fs.readFileSync(file))
        }

        const state = args[0]

        if (!["on", "off"].includes(state)) {
            return sock.sendMessage(from, {
                text: "❌ 𝑬𝒙𝒆𝒎𝒑𝒍𝒆: .𝑎𝑛𝑡𝑖𝑐𝑎𝑙𝑙𝑏𝑙𝑜𝑐𝑘 𝑜𝑛/𝑜𝑓𝑓"
            }, { quoted: msg })
        }

        data.anticallBlock = state === "on"

        fs.writeFileSync(file, JSON.stringify(data, null, 2))

        await sock.sendMessage(from, {
            text: `🚫 𝑩𝒍𝒐𝒄𝒌 𝑪𝒂𝒍𝒍𝒆𝒓 ${state}
            > 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`
        }, { quoted: msg })
    }
}