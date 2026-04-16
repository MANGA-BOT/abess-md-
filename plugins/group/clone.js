module.exports = {

    name: "clone",
    groupOnly: true,
    adminOnly: true,

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid

        const mode = args[0]
        const link = args[1]

        if (mode !== "auto") {
            return sock.sendMessage(from, {
                text: "❌ Exemple : .clone auto https://chat.whatsapp.com/XXXX"
            }, { quoted: msg })
        }

        if (!link) {
            return sock.sendMessage(from, {
                text: "❌ Lien manquant."
            }, { quoted: msg })
        }

        try {

            // ===== EXTRAIRE CODE =====
            const code = link.split("https://chat.whatsapp.com/")[1]

            if (!code) {
                return sock.sendMessage(from, {
                    text: "❌ Lien invalide."
                }, { quoted: msg })
            }

            // ===== REJOINDRE GROUPE =====
            const targetGroup = await sock.groupAcceptInvite(code)

            await sock.sendMessage(from, {
                text: "🚀 Clone auto démarré..."
            }, { quoted: msg })

            // ===== RÉCUP MEMBRES =====
            const metadata = await sock.groupMetadata(from)

            const members = metadata.participants.map(p => p.id)

            let success = 0
            let failed = 0
            let skipped = 0

            for (let user of members) {

                // skip bot lui-même
                if (user.includes(sock.user.id.split(":")[0])) {
                    skipped++
                    continue
                }

                try {

                    const res = await sock.groupParticipantsUpdate(targetGroup, [user], "add")
                    const status = res[0]?.status

                    if (status === "200") {
                        success++
                        console.log("✅ Ajouté:", user)
                    } else {
                        failed++
                        console.log("❌ Refusé:", user, status)
                    }

                } catch (err) {
                    failed++
                    console.log("⚠️ Skip:", user)
                }

                // ===== DELAY 5s =====
                await new Promise(r => setTimeout(r, 5000))
            }

            await sock.sendMessage(from, {
                text:
`📦 CLONE AUTO TERMINÉ

✅ Ajoutés : ${success}
❌ Échecs : ${failed}
⏭️ Ignorés : ${skipped}

⚠️ WhatsApp limite les ajouts automatiques.`
            }, { quoted: msg })

        } catch (err) {

            console.log("CLONE AUTO ERROR:", err)

            await sock.sendMessage(from, {
                text: "❌ Erreur clone auto."
            }, { quoted: msg })
        }
    }
}