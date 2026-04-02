const axios = require("axios")

const API_KEY = process.env.GIFTED_API_KEY || "gifted"

const imageModels = [
    { name: "deepimg", endpoint: "deepimg", format: "json" },
    { name: "flux", endpoint: "fluximg", format: "json_url", extra: "&ratio=1:1" },
    { name: "sora", endpoint: "txt2img", format: "json_url" },
    { name: "magicstudio", endpoint: "magicstudio", format: "direct" }
]

const commands = imageModels.map(model => ({

    name: model.name,
    category: "ai",
    description: `Image AI ${model.name}`,

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const text = args.join(" ")

        if (!text) {
            return sock.sendMessage(from, {
                text: `❌ Exemple : .${model.name} chat robot futuriste`
            }, { quoted: msg })
        }

        // 🎨 réaction
        await sock.sendMessage(from, {
            react: { text: "🎨", key: msg.key }
        })

        try {

            const url = `https://api.giftedtech.co.ke/api/ai/${model.endpoint}?apikey=${API_KEY}&prompt=${encodeURIComponent(text)}${model.extra || ""}`

            let imageUrl

            if (model.format === "direct") {
                imageUrl = url
            } else {

                const { data } = await Promise.race([
                    axios.get(url),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error("Timeout")), 15000)
                    )
                ])

                if (!data || !data.success) {
                    throw new Error("API error")
                }

                if (model.format === "json") {
                    imageUrl = data.result
                } else if (model.format === "json_url") {
                    imageUrl = data.result?.url
                }
            }

            if (!imageUrl) {
                throw new Error("No image")
            }

            // 📤 envoi image
            await sock.sendMessage(from, {
                image: { url: imageUrl },
                caption: `🎨 ${model.name.toUpperCase()}\n\n📝 Prompt:\n${text}`
            }, { quoted: msg })

            // ✅ réaction succès
            await sock.sendMessage(from, {
                react: { text: "✅", key: msg.key }
            })

        } catch (e) {

            console.log(`${model.name} error:`, e.message)

            // ❌ réaction erreur
            await sock.sendMessage(from, {
                react: { text: "❌", key: msg.key }
            })

            if (e.message === "Timeout") {
                return sock.sendMessage(from, {
                    text: "⏳ Génération lente, réessaie"
                }, { quoted: msg })
            }

            await sock.sendMessage(from, {
                text: "❌ Erreur génération image"
            }, { quoted: msg })
        }
    }
}))

module.exports = commands