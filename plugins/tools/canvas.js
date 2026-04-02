const axios = require("axios")

module.exports = {
    name: "canvas",
    aliases: ["spotifycard"],

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const fullArgs = args.join(" ").split("|")

        const title = fullArgs[0]?.trim()
        const text = fullArgs[1]?.trim() || "ABESS-MD"

        if (!title) {
            return sock.sendMessage(from, {
                text: "❌ Exemple: .canvas titre | texte"
            }, { quoted: msg })
        }

        await sock.sendMessage(from, {
            react: { text: "🎨", key: msg.key }
        })

        try {
            const url =
                `https://api.giftedtech.co.ke/api/tools/canvas?apikey=gifted&title=${encodeURIComponent(title)}&type=spotify&text=${encodeURIComponent(text)}&watermark=ABESS-MD`

            await sock.sendMessage(from, {
                image: { url },
                caption: `🎨 CANVAS\n> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`
            }, { quoted: msg })

        } catch {
            await sock.sendMessage(from, {
                text: "❌ Erreur canvas\n> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫"
            }, { quoted: msg })
        }
    }
}