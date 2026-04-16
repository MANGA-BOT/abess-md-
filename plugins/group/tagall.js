module.exports = {
    name: "tagall",
    groupOnly: true,

    async execute(sock, msg) {

        const from = msg.key.remoteJid

        const metadata = await sock.groupMetadata(from)
        const participants = metadata.participants

        const mentions = participants.map(p => p.id)

        // 🔥 Infos groupe
        const groupName = metadata.subject || "Groupe"
        const groupSize = participants.length

        // 🔥 PP groupe
        let pp
        try {
            pp = await sock.profilePictureUrl(from, "image")
        } catch {
            pp = "https://i.ibb.co/7Qm9Y0X/group.png"
        }

        // 🔥 Message stylé
        let text = `
╭━━〔 👥 *TAG ALL* 〕━━⬣
┃ 📛 *Nom* : ${groupName}
┃ 👤 *Membres* : ${groupSize}
╰━━━━━━━━━━━━━━⬣

📣 *MENTIONS* :

`

        for (let p of participants) {
            text += `➤ @${p.id.split("@")[0]}\n`
        }

        text += `\n> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`

        // 🔥 Envoi avec image
        await sock.sendMessage(from, {
            image: { url: pp },
            caption: text,
            mentions
        }, { quoted: msg })
    }
}