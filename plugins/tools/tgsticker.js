const axios = require("axios")

module.exports = {
    name: "tgsticker",
    aliases: ["tgs"],

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const url = args[0]

        const contextInfo = {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363408842235507@newsletter",
                newsletterName: "𒆜 𝙰𝚋𝚎𝚜𝚜-𝙼𝙳 𒆜",
                serverMessageId: 1
            }
        }

        if (!url) {
            return sock.sendMessage(from, {
                text: "❌ Exemple : .tgsticker https://t.me/addstickers/PackName",
                contextInfo
            }, { quoted: msg })
        }

        const match = url.match(/addstickers\/(.+)/)
        if (!match) {
            return sock.sendMessage(from, {
                text: "❌ Lien invalide",
                contextInfo
            }, { quoted: msg })
        }

        const packName = match[1]

        try {

            const { data } = await axios.get(`https://api.telegram.org/bot${process.env.TG_TOKEN}/getStickerSet?name=${packName}`)

            if (!data.ok) {
                return sock.sendMessage(from, {
                    text: "❌ Pack introuvable",
                    contextInfo
                }, { quoted: msg })
            }

            const stickers = data.result.stickers

            await sock.sendMessage(from, {
                text: `📦 ${stickers.length} stickers trouvés...`,
                contextInfo
            }, { quoted: msg })

            for (let i = 0; i < Math.min(stickers.length, 10); i++) {

                const fileId = stickers[i].file_id

                const fileRes = await axios.get(`https://api.telegram.org/bot${process.env.TG_TOKEN}/getFile?file_id=${fileId}`)
                const filePath = fileRes.data.result.file_path

                const fileUrl = `https://api.telegram.org/file/bot${process.env.TG_TOKEN}/${filePath}`

                const buffer = await axios.get(fileUrl, {
                    responseType: "arraybuffer"
                })

                await sock.sendMessage(from, {
                    sticker: buffer.data,
                    contextInfo
                }, { quoted: msg })
            }

        } catch (e) {
            console.log("TG Sticker Error:", e.message)

            sock.sendMessage(from, {
                text: "❌ Erreur téléchargement",
                contextInfo
            }, { quoted: msg })
        }
    }
}