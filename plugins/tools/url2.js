const axios = require("axios")
const FormData = require("form-data")
const { downloadContentFromMessage } = require("@whiskeysockets/baileys")

module.exports = {
    name: "url2",
    aliases: ["imgurl", "tourl"],

    async execute(sock, m, args) {

        const from = m.key.remoteJid
        const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage

        if (!quoted || !quoted.imageMessage) {
            return sock.sendMessage(from, {
                text: "⚠️ Réponds à une image."
            }, { quoted: m })
        }

        await sock.sendMessage(from, {
            text: "⏳ Upload en cours..."
        }, { quoted: m })

        try {

            // 📥 Télécharger image
            const stream = await downloadContentFromMessage(
                quoted.imageMessage,
                "image"
            )

            let buffer = Buffer.from([])
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk])
            }

            // 🔑 API KEY FIXE
            const apiKey = "b3f85642f34dd007dee3b4c89b888e83"

            // 📤 Upload ImgBB
            const form = new FormData()
            form.append("image", buffer.toString("base64"))

            const res = await axios.post(
                `https://api.imgbb.com/1/upload?key=${apiKey}`,
                form,
                { headers: form.getHeaders() }
            )

            const url = res.data.data.url

            // ✅ Réponse stylée
            await sock.sendMessage(from, {
                text:
`╭━━━〔 🌐 IMAGE URL 〕━━━⬣
┃ ✅ Upload réussi
┃ 🔗 ${url}
╰━━━━━━━━━━━━━━━━━━⬣

> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`
            }, { quoted: m })

        } catch (e) {
            console.error("URL ERROR:", e)

            await sock.sendMessage(from, {
                text: "❌ Erreur lors de l'upload."
            }, { quoted: m })
        }
    }
}
