module.exports = {

    name: "numbers",
    aliases: ["members", "listnum"],
    groupOnly: true,

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid

        try {

            const metadata = await sock.groupMetadata(from)

            // ===== EXTRACTION =====
            const numbers = metadata.participants.map(p =>
                p.id.split("@")[0]
            )

            // ===== MODE COPY =====
            if (args[0] === "copy") {

                const result = numbers.join(" ")

                // si trop long → découpage
                if (result.length > 4000) {

                    const chunks = []

                    for (let i = 0; i < numbers.length; i += 40) {
                        chunks.push(numbers.slice(i, i + 40).join(" "))
                    }

                    await sock.sendMessage(from, {
                        text: `📋 COPY MODE (${numbers.length} numéros)`
                    }, { quoted: msg })

                    for (let part of chunks) {
                        await sock.sendMessage(from, {
                            text: part
                        }, { quoted: msg })
                    }

                    return
                }

                return sock.sendMessage(from, {
                    text:
`📋 COPY MODE

${result}

✅ Utilisable avec :
.addall ${numbers.slice(0, 5).join(" ")}...`
                }, { quoted: msg })
            }

            // ===== MODE NORMAL =====
            const result = numbers.join(", ")

            await sock.sendMessage(from, {
                text:
`📋 NUMÉROS

${result}

👥 Total : ${numbers.length}`
            }, { quoted: msg })

        } catch (err) {

            console.log("NUMBERS ERROR:", err)

            await sock.sendMessage(from, {
                text: "❌ Erreur récupération numéros."
            }, { quoted: msg })
        }
    }
}