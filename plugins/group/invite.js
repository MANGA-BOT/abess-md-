module.exports = {
    name: "invite",
    groupOnly: true,

    async execute(sock, msg) {

        const from = msg.key.remoteJid

        try {
            const metadata = await sock.groupMetadata(from)

            const subject = metadata.subject

            let desc = metadata.desc || "Aucune description"

            // 🔥 limiter la taille (IMPORTANT)
            if (desc.length > 120) {
                desc = desc.substring(0, 120) + "..."
            }

            const code = await sock.groupInviteCode(from)
            const link = `https://chat.whatsapp.com/${code}`

            await sock.sendMessage(from, {
                text: `╭━━━〔 📌 GROUPE INFO 〕━━━⬣
┃ 📛 Nom : ${subject}
┃ 📝 Description : ${desc}
┃ 🔗 Lien : ${link}
╰━━━━━━━━━━━━━━━━━━⬣`
            }, { quoted: msg })

        } catch (e) {
            await sock.sendMessage(from, {
                text: "❌ Le bot doit être admin"
            }, { quoted: msg })
        }
    }
}