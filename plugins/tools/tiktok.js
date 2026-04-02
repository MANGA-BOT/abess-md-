const axios = require("axios")

module.exports = {
    name: "tiktok",
    aliases: ["tt", "ttdl"],

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const url = args[0]

        if (!url) {
            return sock.sendMessage(from, {
                text: "❌ Exemple: .tiktok https://tiktok.com/..."
            }, { quoted: msg })
        }

        // ⬇️ réaction
        await sock.sendMessage(from, {
            react: { text: "⬇️", key: msg.key }
        })

        try {

            const { data } = await axios.post(
                "https://www.tikwm.com/api/",
                { url: url }
            )

            if (!data.data) throw new Error("No video")

            const videoUrl = data.data.play
            const author = data.data.author?.nickname || "Unknown"
            const title = data.data.title || "TikTok Video"

            await sock.sendMessage(from, {
                video: { url: videoUrl },
                caption:
`🎵 TikTok Downloader

👤 Auteur: ${author}
📝 ${title}

> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`
            }, { quoted: msg })

            await sock.sendMessage(from, {
                react: { text: "✅", key: msg.key }
            })

        } catch (error) {
            console.log("TikTok Error:", error.message)

            await sock.sendMessage(from, {
                text: "❌ Erreur téléchargement TikTok\n> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫"
            }, { quoted: msg })

            await sock.sendMessage(from, {
                react: { text: "❌", key: msg.key }
            })
        }
    }
}