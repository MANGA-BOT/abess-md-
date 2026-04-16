// 🚀 FIX ANTIDELETE PRO

const fs = require("fs")

module.exports = {
    name: "antidel",
    groupOnly: true,
    adminOnly: true,

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid
        const file = "./database/antidel.json"

        const state = args[0]

        if (!["on", "off"].includes(state)) {
            return sock.sendMessage(from, {
                text: "❌ Exemple: .antidel on/off"
            }, { quoted: msg })
        }

        const data = { enabled: state === "on" }

        fs.writeFileSync(file, JSON.stringify(data, null, 2))

        // 🔥 FORCE UPDATE (IMPORTANT)
        delete require.cache[require.resolve(file)]

        await sock.sendMessage(from, {
            text: `🗑️ AntiDelete ${state}`
        }, { quoted: msg })
    }
}