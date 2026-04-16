const { downloadContentFromMessage } = require("@whiskeysockets/baileys")

module.exports = {
    name: "vv",
    aliases: ["viewonce"],

    async execute(sock, msg) {
        const from = msg.key.remoteJid

        const quoted = msg.message?.extendedTextMessage?.contextInfo

        if (!quoted || !quoted.quotedMessage) {
            return sock.sendMessage(from, {
                text: "❌ 𝑹𝒆𝒑𝒐𝒏𝒅 𝒂 𝒖𝒏 𝒎𝒆𝒅𝒊𝒂 𝒗𝒊𝒆𝒘𝒐𝒏𝒄𝒆 𝒐𝒖 𝒔𝒕𝒂𝒕𝒖𝒔\n> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫"
            }, { quoted: msg })
        }

        let message = quoted.quotedMessage

        // ===== GESTION VIEW ONCE =====
        if (message.viewOnceMessageV2) {
            message = message.viewOnceMessageV2.message
        }

        if (message.viewOnceMessage) {
            message = message.viewOnceMessage.message
        }

        // ===== TYPE MEDIA =====
        const type = Object.keys(message)[0]

        let stream
        let buffer = Buffer.from([])

        try {
            stream = await downloadContentFromMessage(message[type], type.replace("Message", ""))

            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk])
            }

        } catch (e) {
            return sock.sendMessage(from, {
                text: "❌ 𝑰𝒎𝒑𝒐𝒔𝒔𝒊𝒃𝒍𝒆 𝒅𝒆 𝒕𝒆𝒍𝒆𝒄𝒉𝒂𝒓𝒈𝒆𝒓\n> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫"
            }, { quoted: msg })
        }

        // ===== ENVOI SELON TYPE =====
        try {

            if (type === "imageMessage") {
                return sock.sendMessage(from, { image: buffer }, { quoted: msg })
            }

            if (type === "videoMessage") {
                return sock.sendMessage(from, { video: buffer }, { quoted: msg })
            }

            if (type === "audioMessage") {
                return sock.sendMessage(from, {
                    audio: buffer,
                    mimetype: "audio/mpeg"
                }, { quoted: msg })
            }

            if (type === "documentMessage") {
                return sock.sendMessage(from, {
                    document: buffer,
                    mimetype: message[type].mimetype,
                    fileName: message[type].fileName || "file"
                }, { quoted: msg })
            }

            // fallback
            await sock.sendMessage(from, {
                document: buffer,
                fileName: "vv_file"
            }, { quoted: msg })

        } catch (e) {
            sock.sendMessage(from, {
                text: "❌ 𝑬𝒓𝒓𝒆𝒖𝒓 𝒆𝒏𝒗𝒐𝒊 𝒎𝒆𝒅𝒊𝒂\n> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫"
            }, { quoted: msg })
        }
    }
}