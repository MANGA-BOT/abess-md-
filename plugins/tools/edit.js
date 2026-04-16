const axios = require("axios")
const { extractMedia } = require("../../lib/utils")

module.exports = {
    name: "edit",
    aliases: ["aiimg"],

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const prompt = args.join(" ")

        if (!prompt) {
            return sock.sendMessage(from, {
                text: "❌ Exemple:\n.edit add fire effect"
            }, { quoted: msg })
        }

        // 📸 récupérer image
        const media = extractMedia(msg)

        if (!media || media.type !== "imageMessage") {
            return sock.sendMessage(from, {
                text: "❌ Répond à une image"
            }, { quoted: msg })
        }

        try {

            await sock.sendMessage(from, {
                react: { text: "🎨", key: msg.key }
            })

            // 🔥 upload image
            const { uploadMedia } = require("../../lib/mediaUpload")
            const imageUrl = await uploadMedia(media.message)

            if (!imageUrl) {
                return sock.sendMessage(from, {
                    text: "❌ Upload échoué"
                }, { quoted: msg })
            }

            // 🚀 appel API
            const apiUrl = `https://shadowx-editor.vercel.app/api/proxy-edit?url=${encodeURIComponent(imageUrl)}&p=${encodeURIComponent(prompt)}`

            const { data } = await axios.get(apiUrl)

            if (!data.success) throw new Error()

            const result = "https://shadowx-editor.vercel.app" + data.download_url

            // 📤 envoyer image modifiée
            await sock.sendMessage(from, {
                image: { url: result },
                caption:
`🎨 *IMAGE MODIFIÉE*

🧠 Prompt: ${prompt}

> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`
            }, { quoted: msg })

        } catch (e) {
            console.log("EDIT ERROR:", e)

            sock.sendMessage(from, {
                text: "❌ Erreur traitement image"
            }, { quoted: msg })
        }
    }
}