const ytSearch = require("yt-search")
const axios = require("axios")

module.exports = {

    name: "song",
    aliases: ["music", "mp3"],

    async execute(sock, msg, args) {

        try {

            const from = msg.key.remoteJid
            const query = args.join(" ")

            if (!query) {
                return sock.sendMessage(
                    from,
                    { text: "❌ 𝑬𝒙𝒆𝒎𝒑𝒍𝒆 : .𝑠𝑜𝑛𝑔 alan walker faded" },
                    { quoted: msg }
                )
            }

            // ===== RECHERCHE YOUTUBE =====
            const search = await ytSearch(query)
            const video = search.videos[0]

            if (!video) {
                return sock.sendMessage(
                    from,
                    { text: "❌ 𝑴𝒖𝒔𝒊𝒒𝒖𝒆 𝒊𝒏𝒕𝒓𝒐𝒖𝒗𝒂𝒃𝒍𝒆." },
                    { quoted: msg }
                )
            }

            const url = video.url

            // ===== API MP3 =====
            const api = `https://apis.davidcyril.name.ng/download/ytmp3?url=${encodeURIComponent(url)}`
            const { data } = await axios.get(api)

            // ===== EXTRACTION AUDIO (SAFE) =====
            const audio =
                data?.result?.download_url ||
                data?.result?.downloadUrl ||
                data?.download_url ||
                data?.url

            if (!audio) {
                return sock.sendMessage(
                    from,
                    { text: "❌ 𝑰𝒎𝒑𝒐𝒔𝒔𝒊𝒃𝒍𝒆 𝒅𝒆 𝒓𝒆𝒄𝒖𝒑𝒆𝒓𝒆𝒓 𝒍𝒆 𝒇𝒊𝒄𝒉𝒊𝒆𝒓 𝒂𝒖𝒅𝒊𝒐." },
                    { quoted: msg }
                )
            }

            // ===== MESSAGE INFO =====
            const caption = `
╭━━〔    𝑇𝐼𝑇𝐿𝐸 𝑆𝑂𝑁𝐺   .. 〕━━⬣
 🎵 ${video.title}
> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫
`

            // ===== MINIATURE =====
            await sock.sendMessage(
                from,
                {
                    image: { url: video.thumbnail },
                    caption: caption
                },
                { quoted: msg }
            )

            // ===== AUDIO =====
            await sock.sendMessage(
                from,
                {
                    audio: { url: audio },
                    mimetype: "audio/mpeg",
                    fileName: `${video.title}.mp3`
                },
                { quoted: msg }
            )

        } catch (err) {

            console.log("SONG ERROR:", err)

            await sock.sendMessage(
                msg.key.remoteJid,
                { text: "❌ 𝑬𝒓𝒓𝒆𝒖𝒓 𝒕𝒆𝒍𝒆𝒄𝒉𝒂𝒓𝒈𝒆𝒎𝒆𝒏𝒕 𝒎𝒖𝒔𝒊𝒒𝒖𝒆.\n> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫" },
                { quoted: msg }
            )
        }
    }
}