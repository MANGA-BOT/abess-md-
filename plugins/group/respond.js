const fs = require("fs")
const { createWriteStream } = require("fs")
const path = require("path")
const ffmpeg = require("fluent-ffmpeg")

// ⚠️ Support export default OU module.exports
const importedConfig = require("../utils/manageConfigs")
const configManager = importedConfig.default || importedConfig

const { downloadMediaMessage } = require("@whiskeysockets/baileys")

// ======================= TAG AUDIO =======================
async function convertToPTT(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .audioCodec("libopus")
            .format("ogg")
            .audioBitrate("48k")
            .audioChannels(1)
            .save(outputPath)
            .on("end", () => resolve(outputPath))
            .on("error", reject)
    })
}

const commands = [

{
    name: "respond",
    aliases: ["tagrespond"],
    description: "Activer / désactiver la réponse auto quand on te tag",

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const number = sock.user.id.split(":")[0]

        if (!configManager.config.users[number]) {
            configManager.config.users[number] = {}
        }

        const option = (args[0] || "").toLowerCase()

        if (option === "on") {
            configManager.config.users[number].response = true
            configManager.save()

            return sock.sendMessage(from, {
                text: "✅ Réponse automatique activée."
            }, { quoted: msg })
        }

        if (option === "off") {
            configManager.config.users[number].response = false
            configManager.save()

            return sock.sendMessage(from, {
                text: "❌ Réponse automatique désactivée."
            }, { quoted: msg })
        }

        await sock.sendMessage(from, {
            text:
`📌 Utilisation :

.respond on
.respond off`
        }, { quoted: msg })
    }
},

{
    name: "settag",
    aliases: ["setaudio"],
    description: "Définir l'audio de réponse au tag",

    async execute(sock, msg) {

        const from = msg.key.remoteJid
        const number = sock.user.id.split(":")[0]

        try {
            const quoted =
                msg.message?.extendedTextMessage?.contextInfo?.quotedMessage

            if (!quoted || !quoted.audioMessage) {
                return sock.sendMessage(from, {
                    text: "❌ Réponds à un audio."
                }, { quoted: msg })
            }

            const stream = await downloadMediaMessage(
                { message: quoted },
                "stream"
            )

            const filePath = `${number}.mp3`
            const writeStream = createWriteStream(filePath)

            stream.pipe(writeStream)

            writeStream.on("finish", async () => {

                configManager.config.users[number] =
                    configManager.config.users[number] || {}

                configManager.config.users[number].tagAudioPath = filePath
                configManager.save()

                await sock.sendMessage(from, {
                    text: "✅ Audio enregistré avec succès."
                }, { quoted: msg })
            })

            writeStream.on("error", async () => {
                await sock.sendMessage(from, {
                    text: "❌ Erreur pendant l'enregistrement."
                }, { quoted: msg })
            })

        } catch (e) {
            console.log("SETTAG ERROR:", e)

            await sock.sendMessage(from, {
                text: "❌ Erreur."
            }, { quoted: msg })
        }
    }
}

]

// ======================= AUTO RESPOND =======================
commands.respondAuto = async function (msg, sock, lid = []) {

    try {
        const number = sock.user.id.split(":")[0]
        const from = msg.key.remoteJid

        const body =
            msg.message?.extendedTextMessage?.text ||
            msg.message?.conversation ||
            msg.message?.imageMessage?.caption ||
            msg.message?.videoMessage?.caption ||
            ""

        if (!configManager.config.users[number]) return

        const enabled = configManager.config.users[number]?.response
        if (!enabled || msg.key.fromMe) return

        const mentions =
            msg.message?.extendedTextMessage?.contextInfo?.mentionedJid ||
            msg.message?.imageMessage?.contextInfo?.mentionedJid ||
            msg.message?.videoMessage?.contextInfo?.mentionedJid ||
            []

        const myJid = number + "@s.whatsapp.net"

        const tagged =
            mentions.includes(myJid) ||
            body.includes(`@${number}`) ||
            (lid[0] && body.includes("@" + lid[0].split("@")[0]))

        if (!tagged) return

        const inputAudio =
            configManager.config.users[number]?.tagAudioPath || "tag.mp3"

        if (!fs.existsSync(inputAudio)) return

        if (!fs.existsSync("temp")) fs.mkdirSync("temp")

        const outputAudio = path.join("temp", `tag_${Date.now()}.ogg`)
        const convertedPath = await convertToPTT(inputAudio, outputAudio)

        await sock.sendMessage(from, {
            audio: { url: convertedPath },
            mimetype: "audio/ogg; codecs=opus",
            ptt: true
        }, { quoted: msg })

        if (fs.existsSync(convertedPath)) {
            fs.unlinkSync(convertedPath)
        }

    } catch (e) {
        console.log("RESPOND AUTO ERROR:", e)
    }
}

module.exports = commands
