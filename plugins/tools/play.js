const fs = require("fs")
const path = require("path")

const {
    downloadVideoUniversalAlmighty,
    searchYouTubeVideo,
    searchAlternativeVideo,
    getPlatformFromUrl
} = require("../../utils/downloader")

const CACHE_DIR = "./cache"

if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR)

module.exports = {
    name: "play",
    category: "download",

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const query = args.join(" ").trim()

        if (!query) {
            return sock.sendMessage(from, {
                text: "❌ Exemple : .play alan walker faded"
            }, { quoted: msg })
        }

        await sock.sendMessage(from, { react: { text: "🔍", key: msg.key } })

        try {

            let downloadResult
            let sourceName = "YouTube"

            // ===== 🔥 SEARCH =====
            const ytUrl = await searchYouTubeVideo(query)

            if (!ytUrl) throw new Error("Aucune vidéo trouvée")

            downloadResult = await downloadVideoUniversalAlmighty(ytUrl)

            if (!downloadResult.success) {
                const alt = await searchAlternativeVideo(query)
                if (alt) {
                    downloadResult = await downloadVideoUniversalAlmighty(alt.url)
                    sourceName = alt.source
                }
            }

            if (!downloadResult.success) throw new Error("Download failed")

            const fileName = `abess_${Buffer.from(query).toString("hex").slice(0,10)}.mp4`
            const filePath = path.join(CACHE_DIR, fileName)

            // ===== 🔥 CACHE =====
            if (fs.existsSync(filePath)) {

                await sock.sendMessage(from, {
                    text: "⚡ Cache trouvé → envoi rapide..."
                }, { quoted: msg })

            } else {

                fs.copyFileSync(downloadResult.path, filePath)
            }

            // ===== 🎨 MINI PLAYER =====
            const caption = `
╭━━━〔 🎧 𝑨𝑩𝑬𝑺𝑺 𝑷𝑳𝑨𝒀𝑬𝑹 〕━━━⬣
┃ 🎵 ${query}
┃ 🌐 Source : ${sourceName}
┃ 📦 ${(downloadResult.size / 1024 / 1024).toFixed(2)} MB
┃ ⚡ Status : READY
╰━━━━━━━━━━━━━━⬣

⏯️ ▷──────────── 0:00
🔊 Volume: ████████░░
`

            // ===== 📊 FAKE PROGRESS =====
            const progressMsg = await sock.sendMessage(from, {
                text: "📥 Téléchargement...\n[░░░░░░░░░░] 0%"
            }, { quoted: msg })

            for (let i = 1; i <= 10; i++) {
                await new Promise(r => setTimeout(r, 300))
                const bar = "█".repeat(i) + "░".repeat(10 - i)
                await sock.sendMessage(from, {
                    edit: progressMsg.key,
                    text: `📥 Téléchargement...\n[${bar}] ${i * 10}%`
                }).catch(() => {})
            }

            const buffer = fs.readFileSync(filePath)

            // ===== 🎧 AUDIO + VIDEO =====
            await sock.sendMessage(from, {
                audio: buffer,
                mimetype: "audio/mpeg",
                ptt: false
            }, { quoted: msg })

            await sock.sendMessage(from, {
                video: buffer,
                caption
            }, { quoted: msg })

            await sock.sendMessage(from, { react: { text: "✅", key: msg.key } })

        } catch (err) {

            console.error(err)

            await sock.sendMessage(from, {
                text: "❌ Erreur : " + err.message
            }, { quoted: msg })

            await sock.sendMessage(from, { react: { text: "❌", key: msg.key } })
        }
    }
}