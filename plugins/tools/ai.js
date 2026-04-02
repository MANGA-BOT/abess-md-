const axios = require("axios")

module.exports = {
    name: "gpt",
    aliases: ["ai", "bot"],
    category: "ai",
    description: "Chat avec l'IA",

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const text = args.join(" ")

        if (!text) {
            return sock.sendMessage(from, {
                text: "❌ Exemple : .gpt Bonjour"
            }, { quoted: msg })
        }

        // 🧠 réaction
        await sock.sendMessage(from, {
            react: { text: "🧠", key: msg.key }
        })

        try {

            const { data } = await Promise.race([
                axios.get(`https://hercai.onrender.com/v3/hercai?question=${encodeURIComponent(text)}`),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Timeout")), 15000)
                )
            ])

            if (!data || !data.reply) {
                throw new Error("API error")
            }

            await sock.sendMessage(from, {
                text: data.reply
            }, { quoted: msg })

        } catch (e) {

            console.log("GPT error:", e.message)

            if (e.message === "Timeout") {
                return sock.sendMessage(from, {
                    text: "⏳ IA lente, réessaie plus tard"
                }, { quoted: msg })
            }

            await sock.sendMessage(from, {
                text: "❌ Erreur IA"
            }, { quoted: msg })
        }
    }
}