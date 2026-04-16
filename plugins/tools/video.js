// commands/video2.js

const fs = require("fs")

const {
    downloadVideoUniversalAlmighty,
    searchYouTubeVideo,
    searchAlternativeVideo,
    getPlatformFromUrl
} = require("../../utils/downloader")

module.exports = {
    name: "video",
    category: "download",
    description: "Recherche et télécharge une vidéo/chanson",
    usage: ".video <titre>",

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const query = args.join(" ").trim()

        const THUMBNAIL_URL = "https://files.catbox.moe/kda31b.jpg"

        if (!query) {
            await sock.sendMessage(from, {
                text: "> 🚀 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫 : ❌ Exemple : .video alan walker faded",
                contextInfo: {
                    externalAdReply: {
                        title: "ABESS-MD",
                        body: "Recherche vidéo",
                        thumbnailUrl: THUMBNAIL_URL,
                        mediaType: 1
                    }
                }
            }, { quoted: msg })

            return sock.sendMessage(from, { react: { text: "❌", key: msg.key } })
        }

        await sock.sendMessage(from, { react: { text: "⏳", key: msg.key } })

        try {

            let downloadResult = null
            let sourceName = "YouTube"

            await sock.sendMessage(from, {
                text: "> 🔍 𝑹𝒆𝒄𝒉𝒆𝒓𝒄𝒉𝒆 𝒆𝒏 𝒄𝒐𝒖𝒓𝒔...",
                contextInfo: {
                    externalAdReply: {
                        title: "ABESS-MD",
                        body: "Recherche en cours",
                        thumbnailUrl: THUMBNAIL_URL,
                        mediaType: 1
                    }
                }
            }, { quoted: msg })

            // ===== URL DIRECT =====
            if (query.match(/^https?:\/\//)) {

                sourceName = getPlatformFromUrl(query)

                downloadResult = await downloadVideoUniversalAlmighty(query)

                if (!downloadResult.success) {
                    const alt = await searchAlternativeVideo(query)

                    if (alt) {
                        downloadResult = await downloadVideoUniversalAlmighty(alt.url)
                        sourceName = alt.source
                    }
                }

            } else {

                // ===== YOUTUBE =====
                const ytUrl = await searchYouTubeVideo(query)

                if (ytUrl) {
                    downloadResult = await downloadVideoUniversalAlmighty(ytUrl)

                    if (!downloadResult.success) {
                        await sock.sendMessage(from, {
                            text: "> ⚠️ YouTube échoué... recherche alternative...",
                        }, { quoted: msg })

                        const alt = await searchAlternativeVideo(query)

                        if (alt) {
                            downloadResult = await downloadVideoUniversalAlmighty(alt.url)
                            sourceName = alt.source
                        }
                    }

                } else {
                    const alt = await searchAlternativeVideo(query)

                    if (alt) {
                        downloadResult = await downloadVideoUniversalAlmighty(alt.url)
                        sourceName = alt.source
                    } else {
                        throw new Error("Aucune vidéo trouvée")
                    }
                }
            }

            if (!downloadResult || !downloadResult.success) {
                throw new Error("Téléchargement échoué")
            }

            await sock.sendMessage(from, {
                text: `> ✅ ${sourceName.toUpperCase()} trouvé\n📥 Téléchargement...`,
            }, { quoted: msg })

            const fileBuffer = fs.readFileSync(downloadResult.path)

            const caption = `
╭━━━〔 🎬 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫 〕━━━⬣
┃ 🎵 Source : ${sourceName.toUpperCase()}
┃ 📦 Taille : ${(downloadResult.size / 1024 / 1024).toFixed(2)} MB
┃ 🚀 Status : SUCCESS
╰━━━━━━━━━━━━━━⬣
`

            // ===== ENVOI =====
            if (downloadResult.size > 16 * 1024 * 1024) {

                await sock.sendMessage(from, {
                    document: fileBuffer,
                    fileName: `abess_${Date.now()}.mp4`,
                    mimetype: "video/mp4",
                    caption
                }, { quoted: msg })

            } else {

                await sock.sendMessage(from, {
                    video: fileBuffer,
                    mimetype: "video/mp4",
                    caption
                }, { quoted: msg })
            }

            try { fs.unlinkSync(downloadResult.path) } catch {}

            await sock.sendMessage(from, { react: { text: "✅", key: msg.key } })

        } catch (err) {

            console.error("VIDEO ERROR:", err)

            await sock.sendMessage(from, {
                text: `❌ Erreur : ${err.message}`
            }, { quoted: msg })

            await sock.sendMessage(from, { react: { text: "❌", key: msg.key } })
        }
    }
}