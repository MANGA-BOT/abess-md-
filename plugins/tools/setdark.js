const fs = require("fs")
const axios = require("axios")
const FormData = require("form-data")
const { downloadContentFromMessage } = require("@whiskeysockets/baileys")

const FILE = "./database/tagreply.json"

module.exports = {
    name: "setdark",
    ownerOnly: true,

    async execute(sock, msg) {
        const from = msg.key.remoteJid

        let data = {}
        if (fs.existsSync(FILE)) {
            data = JSON.parse(fs.readFileSync(FILE))
        }

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage

        if (!quoted) {
            return sock.sendMessage(from, {
                text: "❌ Répond à un média"
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

            // 🔥 download
            const stream = await downloadContentFromMessage(quoted[type + "Message"], type)

            let buffer = Buffer.from([])
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk])
            }

            // 🔥 upload catbox
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

            // 🔥 save
            data[from] = {
                type,
                url
            }

            fs.writeFileSync(FILE, JSON.stringify(data, null, 2))

            await sock.sendMessage(from, {
                text: `✅ Dark enregistré\n🔗 ${url}`
            }, { quoted: msg })

            await sock.sendMessage(from, { react: { text: "✅", key: msg.key } })

        } catch (e) {
            console.log("SETDARK ERROR:", e.message)

            await sock.sendMessage(from, {
                text: "❌ Échec upload"
            }, { quoted: msg })
        }
    }
}