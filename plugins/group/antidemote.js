const fs = require("fs")

const FILE = "./database/antidemote.json"

module.exports = {
    name: "antidemote",
    groupOnly: true,
    adminOnly: true,

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const state = args[0]

        const contextInfo = {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363408842235507@newsletter",
                newsletterName: "𒆜 𝙰𝚋𝚎𝚜𝚜-𝙼𝙳 𒆜",
                serverMessageId: 1
            }
        }

        if (!["on", "off"].includes(state)) {
            return sock.sendMessage(from, {
                text: "❌ Exemple : .antidemote on/off",
                contextInfo
            }, { quoted: msg })
        }

        let data = {}

        if (fs.existsSync(FILE)) {
            data = JSON.parse(fs.readFileSync(FILE))
        }

        data[from] = state === "on"

        fs.writeFileSync(FILE, JSON.stringify(data, null, 2))

        await sock.sendMessage(from, {
            text: `🛡️ AntiDemote ${state}`,
            contextInfo
        }, { quoted: msg })
    }
}