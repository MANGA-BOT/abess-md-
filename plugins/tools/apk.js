const axios = require("axios")

module.exports = {
    name: "apk",
    aliases: ["app"],

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const name = args.join(" ")

        if (!name) {
            return sock.sendMessage(from, {
                text: "❌ Exemple: .apk whatsapp"
            }, { quoted: msg })
        }

        await sock.sendMessage(from, {
            react: { text: "🤖", key: msg.key }
        })

        try {

            const { data } = await axios.get(
                `https://api.giftedtech.co.ke/api/download/apkdl?apikey=gifted&appName=${encodeURIComponent(name)}`
            )

            if (!data.success) throw new Error()

            await sock.sendMessage(from, {
                document: { url: data.result.download_url },
                fileName: `${data.result.appname}.apk`,
                mimetype: "application/vnd.android.package-archive",
                caption:
`🤖 APK DOWNLOAD

📱 ${data.result.appname}
👨‍💻 ${data.result.developer}

> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`
            }, { quoted: msg })

        } catch (e) {
            await sock.sendMessage(from, {
                text: "❌ Aucun résultat APK\n> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫"
            }, { quoted: msg })
        }
    }
}