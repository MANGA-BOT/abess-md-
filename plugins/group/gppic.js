const { downloadMediaMessage } = require("@whiskeysockets/baileys")

module.exports = {
    name: "gppic",
    aliases: ["setppgc", "gpic"],
    groupOnly: true,
    adminOnly: true,

    async execute(sock, msg) {

        const from = msg.key.remoteJid
        const message = msg.message

        // 🔥 NEWSLETTER
        const contextInfo = {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363408842235507@newsletter",
                newsletterName: "𒆜 𝙰𝚋𝚎𝚜𝚜-𝙼𝙳 𒆜",
                serverMessageId: 1
            }
        }

        let media

        // 📸 image directe
        if (message.imageMessage) {
            media = msg
        }

        // 📸 image en réponse
        else if (message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
            media = {
                message: message.extendedTextMessage.contextInfo.quotedMessage
            }
        }

        if (!media) {
            return sock.sendMessage(from, {
                text: "❌ Envoie ou répond à une image",
                contextInfo
            }, { quoted: msg })
        }

        try {

            const buffer = await downloadMediaMessage(media, "buffer", {})

            await sock.updateProfilePicture(from, buffer)

            await sock.sendMessage(from, {
                text: "✅ Photo du groupe mise à jour",
                contextInfo
            }, { quoted: msg })

        } catch (e) {
            console.log("GPPIC ERROR:", e.message)

            sock.sendMessage(from, {
                text: "❌ Impossible de changer la photo\nVérifie que je suis admin",
                contextInfo
            }, { quoted: msg })
        }
    }
}