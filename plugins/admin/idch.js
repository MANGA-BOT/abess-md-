module.exports = {
    name: "idch",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid

        try {
            const link = args[0]

            if (!link || !link.includes("whatsapp.com/channel/")) {
                return sock.sendMessage(from, {
                    text: "❌ Donne un lien de chaîne WhatsApp\n\nEx: .idch https://whatsapp.com/channel/xxxx"
                }, { quoted: msg })
            }

            // 🔥 EXTRAIRE LE CODE DU LIEN
            const code = link.split("/channel/")[1]

            if (!code) {
                return sock.sendMessage(from, {
                    text: "❌ Lien invalide"
                }, { quoted: msg })
            }

            // 🔥 RECUP INFOS CHANNEL
            const res = await sock.newsletterMetadata("invite", code)

            const id = res.id
            const name = res.name || "Unknown"

            await sock.sendMessage(from, {
                text:
`╭━━━〔 🕷 𝐂𝐇𝐀𝐍𝐍𝐄𝐋 🕷 〕━━━⬣
┃ 🕷 Nom : ${name}
┃ 🕷 ID : ${id}
╰━━━━━━━━━━━━━━⬣`
            }, { quoted: msg })

        } catch (e) {
            console.log("IDCH LINK ERROR:", e)

            await sock.sendMessage(from, {
                text: "❌ Impossible de récupérer l'ID (lien invalide ou privé)"
            }, { quoted: msg })
        }
    }
}