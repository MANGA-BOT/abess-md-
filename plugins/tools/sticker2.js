const { downloadMediaMessage } = require("@whiskeysockets/baileys")
const fs = require("fs")
const path = require("path")
const crypto = require("crypto")

const ffmpeg = require("fluent-ffmpeg")
const ffmpegPath = require("ffmpeg-static")

ffmpeg.setFfmpegPath(ffmpegPath)

module.exports = {
    name: "sticker2",
    aliases: ["s2"],

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const message = msg.message

        let media

        if (message.imageMessage || message.videoMessage) {
            media = msg
        } else if (message.extendedTextMessage?.contextInfo?.quotedMessage) {
            const quoted = message.extendedTextMessage.contextInfo.quotedMessage
            if (quoted.imageMessage || quoted.videoMessage) {
                media = { message: quoted }
            }
        }

        if (!media) {
            return sock.sendMessage(from, {
                text: "❌ Envoie ou répond à une image/gif/vidéo"
            }, { quoted: msg })
        }

        try {
            const buffer = await downloadMediaMessage(media, "buffer", {})

            const id = crypto.randomBytes(5).toString("hex")
            const input = path.join(__dirname, `input_${id}.jpg`)
            const output = path.join(__dirname, `output_${id}.webp`)

            fs.writeFileSync(input, buffer)

            // 🔥 conversion avec fluent-ffmpeg
            ffmpeg(input)
                .outputOptions([
                    "-vcodec libwebp",
                    "-vf scale=512:512:force_original_aspect_ratio=decrease,fps=15",
                    "-lossless 1",
                    "-compression_level 6",
                    "-q:v 80",
                    "-loop 0",
                    "-preset default",
                    "-an",
                    "-vsync 0"
                ])
                .toFormat("webp")
                .save(output)
                .on("end", async () => {

                    const sticker = fs.readFileSync(output)

                    await sock.sendMessage(from, {
                        sticker
                    }, { quoted: msg })

                    fs.unlinkSync(input)
                    fs.unlinkSync(output)
                })
                .on("error", async (err) => {
                    console.log(err)

                    if (fs.existsSync(input)) fs.unlinkSync(input)

                    await sock.sendMessage(from, {
                        text: "❌ Erreur conversion"
                    }, { quoted: msg })
                })

        } catch (e) {
            console.log(e)
        }
    }
}