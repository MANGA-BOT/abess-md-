const axios = require("axios")
const { uploadMedia } = require("../../lib/mediaUpload")
const { extractMedia } = require("../../lib/utils")

module.exports = {
    name: "removebg",
    aliases: ["rmbg", "nobg"],

    async execute(sock, msg) {

        const from = msg.key.remoteJid
        const media = extractMedia(msg)

        if (!media || media.type !== "imageMessage") {
            return sock.sendMessage(from, {
                text: "❌ Réponds à une image"
            }, { quoted: msg })
        }

        await sock.sendMessage(from, {
            react: { text: "✂️", key: msg.key }
        })

        try {
            const mediaMsg = { [media.type]: media.message }
            const imageUrl = await uploadMedia(mediaMsg)

            const { data } = await axios.get(
                `https://api.giftedtech.co.ke/api/tools/removebg?apikey=gifted&url=${encodeURIComponent(imageUrl)}`
            )

            if (!data.success) throw new Error()

            await sock.sendMessage(from, {
                image: { url: data.result.image_url },
                caption: `✂️ REMOVE BG\n> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`
            }, { quoted: msg })

        } catch {
            await sock.sendMessage(from, {
                text: "❌ Échec removebg\n> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫"
            }, { quoted: msg })
        }
    }
}