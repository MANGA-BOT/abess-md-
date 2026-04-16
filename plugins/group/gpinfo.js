module.exports = {
    name: "gpinfo",
    aliases: ["groupinfo", "ginfo"],
    groupOnly: true,

    async execute(sock, msg) {

        const from = msg.key.remoteJid

        // 🔥 NEWSLETTER
        const contextInfo = {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363408842235507@newsletter",
                newsletterName: "𒆜 𝙰𝚋𝚎𝚜𝚜-𝙼𝙳 𒆜",
                serverMessageId: 1
            }
        }

        try {

            const metadata = await sock.groupMetadata(from)

            const name = metadata.subject
            const id = metadata.id
            const owner = metadata.owner || "Inconnu"
            const members = metadata.participants.length
            const desc = metadata.desc || "Aucune description"
            const creation = metadata.creation
                ? new Date(metadata.creation * 1000).toLocaleString()
                : "Inconnu"

            const isClosed = metadata.announce ? "🔒 Fermé (Admins seulement)" : "🔓 Ouvert"

            // 🔥 récupérer photo groupe
            let pp
            try {
                pp = await sock.profilePictureUrl(from, "image")
            } catch {
                pp = "https://files.catbox.moe/34an82.jpg" // fallback
            }

            let text = `
╭━━━〔 📊 INFO GROUPE 〕━━━⬣
┃ 📛 Nom : ${name}
┃ 🆔 ID : ${id}
┃ 👑 Owner : ${owner}
┃ 👥 Membres : ${members}
┃ 🔒 Mode : ${isClosed}
┃ 📅 Création : ${creation}
╰━━━━━━━━━━━━━━━━━━⬣

╭─〔 📝 DESCRIPTION 〕⬣
${desc}
╰━━━━━━━━━━━━━━━━━━⬣
`

            // 📤 envoi avec image
            await sock.sendMessage(from, {
                image: { url: pp },
                caption: text,
                contextInfo
            }, { quoted: msg })

        } catch (e) {
            console.log("GPINFO ERROR:", e.message)

            sock.sendMessage(from, {
                text: "❌ Impossible de récupérer les infos du groupe",
                contextInfo
            }, { quoted: msg })
        }
    }
}