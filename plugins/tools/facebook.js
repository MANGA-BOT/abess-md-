const axios = require("axios")

module.exports = {
    name: "facebook",
    aliases: ["fb", "fbdl"],

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const url = args[0]

        if (!url) {
            return sock.sendMessage(from, {
                text: "❌ Exemple: .fb https://facebook.com/..."
            }, { quoted: msg })
        }

        // 🔥 réaction
        await sock.sendMessage(from, {
            react: { text: "⏳", key: msg.key }
        })

        try {

            const { data } = await axios.get(
                `https://api.giftedtech.co.ke/api/download/facebook?apikey=gifted&url=${encodeURIComponent(url)}`
            )

            if (!data.success) throw new Error("API fail")

            const videoUrl = data.result.hd_video || data.result.sd_video
            const title = data.result.title || "Facebook Video"

            await sock.sendMessage(from, {
                video: { url: videoUrl },
                caption: `📘 Facebook Downloader\n\n🎬 ${title}\n\n> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`
            }, { quoted: msg })

            await sock.sendMessage(from, {
                react: { text: "✅", key: msg.key }
            })

        } catch (e) {
            console.log("FB Error:", e.message)

            await sock.sendMessage(from, {
                text: "❌ Erreur téléchargement Facebook\n> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫"
            }, { quoted: msg })

            await sock.sendMessage(from, {
                react: { text: "❌", key: msg.key }
            })
        }
    }
}