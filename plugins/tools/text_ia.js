const axios = require("axios")

const API_KEY = process.env.GIFTED_API_KEY || "gifted"

const textModels = [
    { name: "gpt4o", endpoint: "gpt4o", desc: "GPT-4o" },
    { name: "gemini", endpoint: "gemini", desc: "Gemini" },
    { name: "venice", endpoint: "venice", desc: "Venice" },
    { name: "unlimitedai", endpoint: "unlimitedai", desc: "Unlimited AI" },
    { name: "letme", endpoint: "letmegpt", desc: "LetMeGPT", isUrl: true }
]

const commands = textModels.map(model => ({

    name: model.name,
    category: "ai",
    description: model.desc,

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const text = args.join(" ")

        if (!text) {
            return sock.sendMessage(from, {
                text: `❌ Exemple : .${model.name} bonjour`
            }, { quoted: msg })
        }

        // 🧠 réaction
        await sock.sendMessage(from, {
            react: { text: "🧠", key: msg.key }
        })

        try {

            const { data } = await Promise.race([
                axios.get(`https://api.giftedtech.co.ke/api/ai/${model.endpoint}?apikey=${API_KEY}&q=${encodeURIComponent(text)}`),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Timeout")), 15000)
                )
            ])

            let reply

            if (model.isUrl) {
                reply = typeof data === "string"
                    ? data
                    : data.result || data.url || "⚠️ Réponse vide"
            } else {
                if (!data || !data.success || !data.result) {
                    throw new Error("API error")
                }
                reply = data.result
            }

            await sock.sendMessage(from, {
                text: reply
            }, { quoted: msg })

        } catch (e) {

            console.log(`${model.name} error:`, e.message)

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
}))

// 🔥 IA personnalisée REN
commands.push({
    name: "ren",
    aliases: ["renai"],
    category: "ai",
    description: "IA REN personnalisée",

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const text = args.join(" ")

        if (!text) {
            return sock.sendMessage(from, {
                text: "❌ Exemple : .ren bonjour"
            }, { quoted: msg })
        }

        await sock.sendMessage(from, {
            react: { text: "🧠", key: msg.key }
        })

        const prompt = "Tu es REN-MDX, un bot WhatsApp ultra-performant, rapide et intelligent."

        try {

            const { data } = await Promise.race([
                axios.get(`https://api.giftedtech.co.ke/api/ai/custom?apikey=${API_KEY}&q=${encodeURIComponent(text)}&prompt=${encodeURIComponent(prompt)}`),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Timeout")), 15000)
                )
            ])

            if (!data || !data.success || !data.result) {
                throw new Error("API error")
            }

            await sock.sendMessage(from, {
                text: data.result
            }, { quoted: msg })

        } catch (e) {

            console.log("REN error:", e.message)

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
})

module.exports = commands