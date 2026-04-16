const axios = require("axios")

const PIN_API = "https://egret-driving-cattle.ngrok-free.app/api/pin"

module.exports = {

    name: "pinterest",
    aliases: ["pin", "image","img"],

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const input = args.join(" ").trim()

        if (!input) {
            return sock.sendMessage(
                from,
                { text: "❌ 𝑬𝒙𝒆𝒎𝒑𝒍𝒆 : .𝑝𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡 𝑐𝑎𝑡 -5" },
                { quoted: msg }
            )
        }

        try {

            // ===== PARSE QUERY + COUNT =====
            let query = input
            let count = 5

            const match = input.match(/(.+?)(?:\s*-\s*(\d+))?$/)

            if (match) {
                query = match[1].trim()
                if (match[2]) count = parseInt(match[2])
            }

            if (count > 10) count = 10
            if (count < 1) count = 1

            // ===== MESSAGE ATTENTE =====
            await sock.sendMessage(
                from,
                {
                    text:
`📌 𝑅𝑒𝑐ℎ𝑒𝑟𝑐ℎ𝑒 𝑑'𝑖𝑚𝑎𝑔𝑒...`
                },
                { quoted: msg }
            )

            // ===== API CALL =====
            const url = `${PIN_API}?query=${encodeURIComponent(query)}&num=${count}`
            const { data } = await axios.get(url)

            const urls = data?.results || data?.result || []

            if (!urls.length) {
                return sock.sendMessage(
                    from,
                    { text: `❌ 𝑨𝒖𝒄𝒖𝒏 𝒓𝒆𝒔𝒖𝒍𝒕𝒂𝒕 𝒑𝒐𝒖𝒓 "${query}"` },
                    { quoted: msg }
                )
            }

            // ===== ENVOI IMAGES =====
            const images = urls.slice(0, count)

            for (let img of images) {
                await sock.sendMessage(
                    from,
                    { image: { url: img } },
                    { quoted: msg }
                )
            }

            // ===== MESSAGE FINAL =====
            await sock.sendMessage(
                from,
                {
                    text:`> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`
                },
                { quoted: msg }
            )

        } catch (err) {

            console.log("PINTEREST ERROR:", err.response?.data || err.message)

            await sock.sendMessage(
                from,
                { text: "❌ 𝑬𝒓𝒓𝒆𝒖𝒓 𝒓𝒆𝒄𝒖𝒑𝒆𝒓𝒂𝒕𝒊𝒐𝒏 𝒊𝒎𝒂𝒈𝒆." },
                { quoted: msg }
            )
        }
    }
}