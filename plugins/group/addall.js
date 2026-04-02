module.exports = {

    name: "addall",
    groupOnly: true,
    adminOnly: true,

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid

        if (!args.length) {
            return sock.sendMessage(from, {
                text: "❌ Exemple : .addall 2376xxx 2376xxx"
            }, { quoted: msg })
        }

        try {

            let success = 0
            let failed = 0
            let skipped = 0

            // ===== FORMAT NUMÉROS =====
            const numbers = args.map(num =>
                num.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
            )

            await sock.sendMessage(from, {
                text: `🚀 Ajout de ${numbers.length} membres en cours...`
            }, { quoted: msg })

            for (let user of numbers) {

                // skip vide
                if (!user || user.length < 5) {
                    skipped++
                    continue
                }

                try {

                    const res = await sock.groupParticipantsUpdate(from, [user], "add")
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
                    console.log("⚠️ Erreur:", user)
                }

                // ===== DELAY 5s =====
                await new Promise(r => setTimeout(r, 5000))
            }

            await sock.sendMessage(from, {
                text:
`📦 ADDALL TERMINÉ

✅ Ajoutés : ${success}
❌ Échecs : ${failed}
⏭️ Ignorés : ${skipped}

⚠️ WhatsApp peut limiter certains ajouts.`
            }, { quoted: msg })

        } catch (err) {

            console.log("ADDALL ERROR:", err)

            await sock.sendMessage(from, {
                text: "❌ Erreur lors de l’ajout."
            }, { quoted: msg })
        }
    }
}