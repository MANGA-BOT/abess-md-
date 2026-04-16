const { downloadMediaMessage } = require("@whiskeysockets/baileys")

module.exports = {
    name: "toimage",

    async execute(sock, msg) {
        const from = msg.key.remoteJid
        const quoted = msg.message?.extendedTextMessage?.contextInfo

        if (!quoted) {
            return sock.sendMessage(from, {
                text: "❌ 𝑹𝒆𝒑𝒐𝒏𝒅 𝒂 𝒖𝒏 𝒔𝒕𝒊𝒄𝒌𝒆𝒓\n> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫"
            }, { quoted: msg })
        }

        const m = {
            message: {
                stickerMessage: quoted.quotedMessage?.stickerMessage
            }
        }

        if (!m.message.stickerMessage) {
            return sock.sendMessage(from, {
                text: "❌ 𝑪𝒆 𝒏'𝒆𝒔𝒕 𝒑𝒂𝒔 𝒖𝒏 𝒔𝒕𝒊𝒄𝒌𝒆𝒓"
            }, { quoted: msg })
        }

        const buffer = await downloadMediaMessage(m, "buffer", {})

        await sock.sendMessage(from, {
            image: buffer
        }, { quoted: msg })
    }
}