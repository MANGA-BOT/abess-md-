const fs = require("fs")

const FILE = "./database/tagreply.json"

module.exports = {
    name: "settag",
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
                text: "❌ Répond à un message (texte/image/vidéo/sticker)"
            }, { quoted: msg })
        }

        let content = {}

        // 📩 TEXTE
        if (quoted.conversation || quoted.extendedTextMessage) {
            content = {
                type: "text",
                text: quoted.conversation || quoted.extendedTextMessage.text
            }
        }

        // 🖼️ IMAGE
        else if (quoted.imageMessage) {
            content = {
                type: "image",
                media: quoted.imageMessage
            }
        }

        // 🎥 VIDEO
        else if (quoted.videoMessage) {
            content = {
                type: "video",
                media: quoted.videoMessage
            }
        }

        // 🧾 STICKER
        else if (quoted.stickerMessage) {
            content = {
                type: "sticker",
                media: quoted.stickerMessage
            }
        }

        else {
            return sock.sendMessage(from, {
                text: "❌ Type non supporté"
            }, { quoted: msg })
        }

        // 🔥 SAVE
        data[from] = content
        fs.writeFileSync(FILE, JSON.stringify(data, null, 2))

        await sock.sendMessage(from, {
            text: "✅ Réponse de tag enregistrée"
        }, { quoted: msg })
    }
}