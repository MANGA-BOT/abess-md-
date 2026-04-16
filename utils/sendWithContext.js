// utils/sendWithContext.js
const fs = require('fs')
const path = require('path')
const { WA_CHANNEL } = require('../config')

const NEWSLETTER_JID = "120363407096919821@newsletter"
const NEWSLETTER_NAME = "×͜× 𝐓𝐇𝐄 𝐃𝐀𝐑𝐊𝐍𝐄𝐒𝐒┇ 𝐀𝐁𝐈́𝐌𝐄 ×͜×"

let thumbBuffer = null

try {
    const imagePath = path.resolve('3.png')

    if (fs.existsSync(imagePath)) {
        thumbBuffer = fs.readFileSync(imagePath)
    } else {
        const imagePathJpg = path.resolve('3.jpg')
        if (fs.existsSync(imagePathJpg)) {
            thumbBuffer = fs.readFileSync(imagePathJpg)
        }
    }
} catch (err) {
    console.error("❌ Erreur chargement thumbnail 3.png :", err.message)
}

function getContextInfo() {
    return {
        forwardingScore: 99,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: NEWSLETTER_JID,
            newsletterName: NEWSLETTER_NAME,
            serverMessageId: -1
        },
        externalAdReply: {
            title: "Rejoins notre chaîne WhatsApp",
            body: "×͜× 𝐓𝐇𝐄 𝐃𝐀𝐑𝐊𝐍𝐄𝐒𝐒┇ 𝐀𝐁𝐈́𝐌𝐄 ×͜×",
            mediaType: 1,
            thumbnail: thumbBuffer,
            renderLargerThumbnail: false,
            mediaUrl: WA_CHANNEL,
            sourceUrl: WA_CHANNEL,
            thumbnailUrl: WA_CHANNEL
        }
    }
}

async function sendWithContext(client, remoteJid, content, options = {}) {
    const contextInfo = getContextInfo()

    const message = {
        ...content,
        contextInfo
    }

    return await client.sendMessage(remoteJid, message, options)
}

module.exports = {
    sendWithContext,
    getContextInfo
}