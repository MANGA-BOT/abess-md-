const axios = require("axios")

module.exports = {
    name: "facebook",
    aliases: ["fb", "fbdl"],

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const url = args[0]

        if (!url) {
            return sock.sendMessage(from, {
                text:
`❌ Utilisation :

.facebook lien
.fb lien

Exemple :
.fb https://facebook.com/...`
            }, { quoted: msg })
        }

        await sock.sendMessage(from, {
            react: { text: "📥", key: msg.key }
        })

        try {

            const { data } = await axios.post(
                "http://45.41.206.33:3000/api/analyze",
                { url },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    timeout: 60000
                }
            )

            if (!data?.success || !data?.metadata) {
                throw new Error("Réponse API invalide")
            }

            const meta = data.metadata
            const formats = Array.isArray(meta.formats) ? meta.formats : []

            if (!formats.length) {
                throw new Error("Aucun format trouvé")
            }

            // 🔥 choisir la meilleure qualité (hauteur max)
            const best = formats
                .filter(v => v.url)
                .sort((a, b) => (b.height || 0) - (a.height || 0))[0]

            if (!best?.url) {
                throw new Error("Lien vidéo introuvable")
            }

            const title = meta.title || "Facebook Video"
            const uploader = meta.uploader || "Inconnu"
            const quality = best.label || `${best.height || "?"}p`
            const duration = meta.duration
                ? `${Math.floor(meta.duration)} sec`
                : "Inconnue"

            const captionInfo =
`╭━━━〔 🎬 FACEBOOK DOWNLOADER 〕━━━⬣
┃ 📌 Titre : ${title}
┃ 👤 Auteur : ${uploader}
┃ 🎞️ Qualité : ${quality}
┃ ⏱️ Durée : ${duration}
╰━━━━━━━━━━━━━━━━━━⬣

⏳ Téléchargement en cours...`

            // 📸 miniature
            if (meta.thumbnail) {
                await sock.sendMessage(from, {
                    image: { url: meta.thumbnail },
                    caption: captionInfo
                }, { quoted: msg })
            } else {
                await sock.sendMessage(from, {
                    text: captionInfo
                }, { quoted: msg })
            }

            // 🎥 envoyer vidéo
            await sock.sendMessage(from, {
                video: { url: best.url },
                caption:
`╭━━━〔 ✅ DOWNLOAD TERMINÉ 〕━━━⬣
┃ 🎬 ${title}
┃ 🎞️ ${quality}
╰━━━━━━━━━━━━━━━━━━⬣

> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`
            }, { quoted: msg })

        } catch (e) {
            console.log("FB ERROR:", e.message)

            sock.sendMessage(from, {
                text:
`❌ Impossible de télécharger cette vidéo Facebook.

🔹 Vérifie le lien
🔹 Vidéo privée non supportée
🔹 API indisponible`
            }, { quoted: msg })
        }
    }
}
