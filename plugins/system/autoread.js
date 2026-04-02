const fs = require("fs")

module.exports = {
    name: "autoread",
    ownerOnly: true,

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid
        const file = "./database/settings.json"

        let data = { autoread: true }

        if (fs.existsSync(file)) {
            data = JSON.parse(fs.readFileSync(file))
        }

        const state = args[0]

        if (!["on", "off"].includes(state)) {
            return sock.sendMessage(from, {
                text: "❌ 𝑬𝒙𝒆𝒎𝒑𝒍𝒆: .𝑎𝑢𝑡𝑜𝑟𝑒𝑎𝑑 𝑜𝑛/𝑜𝑓𝑓"
            }, { quoted: msg })
        }

        data.autoread = state === "on"

        fs.writeFileSync(file, JSON.stringify(data, null, 2))

        await sock.sendMessage(from, {
            text: `👁️ 𝑨𝒖𝒕𝒊𝑹𝒆𝒂𝒅 ${state}
            > 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`
        }, { quoted: msg })
    }
}