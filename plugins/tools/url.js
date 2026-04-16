const axios = require("axios")
const FormData = require("form-data")
const { downloadContentFromMessage } = require("@whiskeysockets/baileys")

module.exports = {
    name: "url",
    aliases: ["tourl"],
    description: "Upload média et obtenir lien",

    async execute(sock, msg) {
        const from = msg.key.remoteJid

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage

        if (!quoted) {
            return sock.sendMessage(from, {
                text: "❌ Répond à une image, vidéo, audio ou sticker"
            }, { quoted: msg })
        }

        let type = null
        let mime = ""

        if (quoted.imageMessage) {
            type = "image"
            mime = quoted.imageMessage.mimetype
        } else if (quoted.videoMessage) {
            type = "video"
            mime = quoted.videoMessage.mimetype
        } else if (quoted.audioMessage) {
            type = "audio"
            mime = quoted.audioMessage.mimetype
        } else if (quoted.stickerMessage) {
            type = "sticker"
            mime = "image/webp"
        } else {
            return sock.sendMessage(from, {
                text: "❌ Type non supporté"
            }, { quoted: msg })
        }

        try {
            await sock.sendMessage(from, { react: { text: "⏳", key: msg.key } })

            // 🔥 DOWNLOAD MEDIA
            const stream = await downloadContentFromMessage(quoted[type + "Message"], type)

            let buffer = Buffer.from([])
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk])
            }

            // 🔥 UPLOAD CATBOX
            const form = new FormData()
            form.append("fileToUpload", buffer, {
                filename: "file",
                contentType: mime
            })
            form.append("reqtype", "fileupload")

            const res = await axios.post("https://catbox.moe/user/api.php", form, {
                headers: form.getHeaders()
            })

            const url = res.data

            await sock.sendMessage(from, {
                text: `🔗 *URL généré :*\n${url}`
            }, { quoted: msg })

            await sock.sendMessage(from, { react: { text: "✅", key: msg.key } })

        } catch (e) {
            console.log("URL ERROR:", e.message)

            await sock.sendMessage(from, {
                text: "❌ Échec upload"
            }, { quoted: msg })

            await sock.sendMessage(from, { react: { text: "❌", key: msg.key } })
        }
    }
}