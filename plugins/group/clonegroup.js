module.exports = {

    name: "clonegroup",
    groupOnly: true,
    adminOnly: true,

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const link = args[0]

        if (!link) {
            return sock.sendMessage(from, {
                text: "❌ Exemple : .clonegroup https://chat.whatsapp.com/XXXX"
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

            // ===== REJOINDRE GROUPE CIBLE =====
            const targetGroup = await sock.groupAcceptInvite(code)

            await sock.sendMessage(from, {
                text: "✅ Groupe cible rejoint. Début du clonage..."
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
                    // 🔥 skip erreur sans crash
                    failed++
                    console.log("⚠️ Skip:", user, err.message)
                }

                // ===== DELAY 5 SECONDES =====
                await new Promise(r => setTimeout(r, 5000))
            }

            await sock.sendMessage(from, {
                text:
`📦 CLONAGE TERMINÉ

✅ Ajoutés : ${success}
❌ Échecs : ${failed}
⏭️ Ignorés : ${skipped}

⚠️ WhatsApp limite les ajouts automatiques.`
            }, { quoted: msg })

        } catch (err) {

            console.log("CLONE ERROR:", err)

            await sock.sendMessage(from, {
                text: "❌ Erreur lors du clonage."
            }, { quoted: msg })
        }
    }
}