const axios = require("axios")

module.exports = {
    name: "mediafire",
    aliases: ["mf"],

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const url = args[0]

        if (!url) {
            return sock.sendMessage(from, {
                text: "❌ Exemple: .mediafire lien"
            }, { quoted: msg })
        }

        await sock.sendMessage(from, {
            react: { text: "📦", key: msg.key }
        })

        try {

            const { data } = await axios.get(
                `https://api.giftedtech.co.ke/api/download/mediafire?apikey=gifted&url=${encodeURIComponent(url)}`
            )

            if (!data.success) throw new Error()

            await sock.sendMessage(from, {
                document: { url: data.result.downloadUrl },
                fileName: data.result.fileName,
                mimetype: data.result.mimeType,
                caption:
`📦 MEDIAFIRE

📄 ${data.result.fileName}
📏 ${data.result.fileSize}

> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`
            }, { quoted: msg })

        } catch (e) {
            await sock.sendMessage(from, {
                text: "❌ Erreur téléchargement Mediafire\n> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫"
            }, { quoted: msg })
        }
    }
}