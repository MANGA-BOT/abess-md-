module.exports = {
    name: "repo",
    aliases: ["sc", "script", "source"],

    async execute(sock, msg) {

        const from = msg.key.remoteJid

        const repoUrl = "https://github.com/MANGA-BOT/abess-md-.git"
        const zipUrl = "https://github.com/MANGA-BOT/abess-md-/archive/refs/heads/main.zip"

        const caption = `
╭━━━〔 🚀 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫 𝑹𝑬𝑷𝑶 〕━━━⬣
┃ 👑 Owner : MANGA-BOT
┃ 🌐 GitHub : Repo Officiel
┃ ⚡ Version : Stable
┃ 📦 Type : WhatsApp Bot
╰━━━━━━━━━━━━━━━━━━⬣

╭─〔 📥 𝑫𝑶𝑾𝑵𝑳𝑶𝑨𝑫 〕⬣
┃ 🔗 Repo : ${repoUrl}
┃ 📁 ZIP : main branch
╰━━━━━━━━━━━━━━━━━━⬣

╭─〔 💡 𝑰𝑵𝑭𝑶 〕⬣
┃ ⬡ Télécharge le fichier complet
┃ ⬡ Modifie à ta guise
┃ ⬡ Déploie sur VPS / Panel
╰━━━━━━━━━━━━━━━━━━⬣

> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫
`

        try {

            await sock.sendMessage(from, {
                image: {
                    url: "https://files.catbox.moe/34an82.jpg"
                },
                caption
            }, { quoted: msg })

            await sock.sendMessage(from, {
                document: {
                    url: zipUrl
                },
                mimetype: "application/zip",
                fileName: "ABESS-MD.zip",
                caption: "📦 Voici le fichier complet du bot"
            }, { quoted: msg })

        } catch (e) {

            sock.sendMessage(from, {
                text:
`❌ Impossible d'envoyer le repo.

🔗 ${repoUrl}`
            }, { quoted: msg })
        }
    }
}
