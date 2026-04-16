const axios = require("axios")

module.exports = {
    name: "gdrive",
    aliases: ["drive"],

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const url = args[0]

        if (!url) {
            return sock.sendMessage(from, {
                text: "❌ Exemple: .gdrive lien"
            }, { quoted: msg })
        }

        await sock.sendMessage(from, {
            react: { text: "⬇️", key: msg.key }
        })

        try {

            const { data } = await axios.get(
                `https://api.giftedtech.co.ke/api/download/gdrivedl?apikey=gifted&url=${encodeURIComponent(url)}`
            )

            if (!data.success) throw new Error()

            await sock.sendMessage(from, {
                document: { url: data.result.download_url },
                fileName: data.result.name,
                mimetype: "application/octet-stream",
                caption: `📁 GDRIVE\n\n📄 ${data.result.name}\n\n> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`
            }, { quoted: msg })

        } catch (e) {
            await sock.sendMessage(from, {
                text: "❌ Erreur téléchargement GDrive\n> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫"
            }, { quoted: msg })
        }
    }
}