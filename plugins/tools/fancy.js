const axios = require("axios")

module.exports = {
    name: "fancy",
    aliases: ["font", "style"],

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const text = args.join(" ")

        if (!text) {
            return sock.sendMessage(from, {
                text: "❌ Exemple: .fancy bonjour"
            }, { quoted: msg })
        }

        // ✨ réaction
        await sock.sendMessage(from, {
            react: { text: "✨", key: msg.key }
        })

        try {

            const { data } = await axios.get(
                `https://api.giftedtech.co.ke/api/tools/fancy?apikey=gifted&text=${encodeURIComponent(text)}`
            )

            if (!data.success || !data.results) throw new Error()

            let reply = `✨ *FANCY TEXT*\n\n`

            data.results.forEach((item, index) => {
                reply += `*${index + 1}.* ${item.result}\n`
            })

            reply += "\n> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫"

            await sock.sendMessage(from, {
                text: reply.trim()
            }, { quoted: msg })

        } catch (e) {
            console.log("Fancy Error:", e.message)

            await sock.sendMessage(from, {
                text: "❌ Erreur formatage texte\n> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫"
            }, { quoted: msg })
        }
    }
}