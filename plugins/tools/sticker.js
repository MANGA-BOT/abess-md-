const { downloadMediaMessage } = require("@whiskeysockets/baileys")
const fs = require("fs")
const path = require("path")
const { exec } = require("child_process")
const crypto = require("crypto")

module.exports = {
    name: "sticker",
    aliases: ["s"],

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const message = msg.message

        // ===== CONFIG =====
        let packname = "ABESS-MD"
        let author = "BOT"

        if (args.join(" ").includes("|")) {
            const text = args.join(" ").split("|")
            packname = text[0] || packname
            author = text[1] || author
        }

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
            // ===== DOWNLOAD =====
            const buffer = await downloadMediaMessage(media, "buffer", {})

            // 🔥 nom unique (anti crash multi-user)
            const id = crypto.randomBytes(6).toString("hex")
            const input = path.join(__dirname, `input_${id}.jpg`)
            const output = path.join(__dirname, `output_${id}.webp`)

            fs.writeFileSync(input, buffer)

            // ===== FFMPEG =====
            exec(
                `ffmpeg -i ${input} -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15" -vcodec libwebp -lossless 1 -compression_level 6 -q:v 80 -loop 0 -preset default -an -vsync 0 ${output}`,
                async (err) => {

                    if (err) {
                        console.log(err)

                        // cleanup sécurité
                        if (fs.existsSync(input)) fs.unlinkSync(input)

                        return sock.sendMessage(from, {
                            text: "❌ Erreur conversion sticker"
                        }, { quoted: msg })
                    }

                    const stickerBuffer = fs.readFileSync(output)

                    await sock.sendMessage(from, {
                        sticker: stickerBuffer,
                        packname,
                        author
                    }, { quoted: msg })

                    // 🔥 CLEANUP SAFE
                    if (fs.existsSync(input)) fs.unlinkSync(input)
                    if (fs.existsSync(output)) fs.unlinkSync(output)
                }
            )

        } catch (e) {
            console.log(e)
            return sock.sendMessage(from, {
                text: "❌ Erreur traitement média"
            }, { quoted: msg })
        }
    }
}