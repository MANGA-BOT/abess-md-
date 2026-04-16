const { downloadContentFromMessage } = require('@whiskeysockets/baileys')

module.exports = {
    name: "gstatus",
    groupOnly: true,
    adminOnly: true,

    async execute(client, msg, args) {

        const from = msg.key.remoteJid

        const metadata = await client.groupMetadata(from)
        const participants = metadata.participants.map(p => p.id)

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
        const target = quoted || msg.message

        let content = {}

        // ===== IMAGE =====
        if (target.imageMessage) {
            const stream = await downloadContentFromMessage(target.imageMessage, 'image')
            let buffer = Buffer.from([])
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])

            content = {
                image: buffer,
                caption: target.imageMessage.caption || args.join(" ")
            }
        }

        // ===== VIDEO =====
        else if (target.videoMessage) {
            const stream = await downloadContentFromMessage(target.videoMessage, 'video')
            let buffer = Buffer.from([])
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])

            content = {
                video: buffer,
                caption: target.videoMessage.caption || args.join(" ")
            }
        }

        // ===== TEXTE =====
        else {
            content = {
                text: args.join(" ") || "📢 Groupe broadcast"
            }
        }

        // 🔥 ENVOI STATUS
        await client.sendMessage("status@broadcast", content, {
            statusJidList: participants
        })

        await client.sendMessage(from, {
            text: "✅ Status envoyé aux membres"
        }, { quoted: msg })
    }
}