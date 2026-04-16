function extractMedia(msg) {
    try {
        let message = msg.message

        if (!message) return null

        // 🔥 VIEW ONCE FIX
        if (message.viewOnceMessage?.message) {
            message = message.viewOnceMessage.message
        }

        if (message.viewOnceMessageV2?.message) {
            message = message.viewOnceMessageV2.message
        }

        // 📸 IMAGE
        if (message.imageMessage) {
            return {
                type: "imageMessage",
                message: message.imageMessage,
                mime: message.imageMessage.mimetype
            }
        }

        // 🎥 VIDEO
        if (message.videoMessage) {
            return {
                type: "videoMessage",
                message: message.videoMessage,
                mime: message.videoMessage.mimetype
            }
        }

        // 📦 STICKER
        if (message.stickerMessage) {
            return {
                type: "stickerMessage",
                message: message.stickerMessage,
                mime: "image/webp"
            }
        }

        // 🔊 AUDIO (AJOUT)
        if (message.audioMessage) {
            return {
                type: "audioMessage",
                message: message.audioMessage,
                mime: message.audioMessage.mimetype
            }
        }

        // 📄 DOCUMENT (AJOUT)
        if (message.documentMessage) {
            return {
                type: "documentMessage",
                message: message.documentMessage,
                mime: message.documentMessage.mimetype
            }
        }

        // 🔁 REPLY (ULTRA FIX)
        let quoted =
            message.extendedTextMessage?.contextInfo?.quotedMessage

        if (quoted) {

            // 🔥 VIEW ONCE REPLY
            if (quoted.viewOnceMessage?.message) {
                quoted = quoted.viewOnceMessage.message
            }

            if (quoted.viewOnceMessageV2?.message) {
                quoted = quoted.viewOnceMessageV2.message
            }

            if (quoted.imageMessage) {
                return {
                    type: "imageMessage",
                    message: quoted.imageMessage,
                    mime: quoted.imageMessage.mimetype
                }
            }

            if (quoted.videoMessage) {
                return {
                    type: "videoMessage",
                    message: quoted.videoMessage,
                    mime: quoted.videoMessage.mimetype
                }
            }

            if (quoted.stickerMessage) {
                return {
                    type: "stickerMessage",
                    message: quoted.stickerMessage,
                    mime: "image/webp"
                }
            }

            if (quoted.audioMessage) {
                return {
                    type: "audioMessage",
                    message: quoted.audioMessage,
                    mime: quoted.audioMessage.mimetype
                }
            }

            if (quoted.documentMessage) {
                return {
                    type: "documentMessage",
                    message: quoted.documentMessage,
                    mime: quoted.documentMessage.mimetype
                }
            }
        }

        return null

    } catch (e) {
        console.log("extractMedia error:", e)
        return null
    }
}

module.exports = { extractMedia }