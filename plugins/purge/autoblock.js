// 🔥 stockage en RAM (global)
const loops = {}

module.exports = {
    name: "autoblock",
    ownerOnly: true,

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const isPrivate = !from.endsWith("@g.us")

        if (!isPrivate) {
            return sock.sendMessage(from, {
                text: "❌ Commande privée seulement"
            }, { quoted: msg })
        }

        const state = args[0]

        if (!["on", "off"].includes(state)) {
            return sock.sendMessage(from, {
                text: "❌ Exemple : .autoblock on/off"
            }, { quoted: msg })
        }

        // 🔥 ON
        if (state === "on") {

            // évite double boucle
            if (loops[from]) {
                return sock.sendMessage(from, {
                    text: "⚠️ AutoBlock déjà actif"
                }, { quoted: msg })
            }

            await sock.sendMessage(from, {
                text: "🤖 AutoBlock activé"
            }, { quoted: msg })

            // 🔥 LOOP
            loops[from] = setInterval(async () => {
                try {

                    let jid = from

                    // 🔥 conversion lid → s.whatsapp.net
                    if (jid.endsWith("@lid")) {
                        jid = jid.replace("@lid", "@s.whatsapp.net")
                    }

                    await sock.updateBlockStatus(jid, "block")

                    await new Promise(r => setTimeout(r, 1500))

                    await sock.updateBlockStatus(jid, "unblock")

                    console.log("🔁 AutoBlock:", jid)

                } catch (e) {
                    console.log("AutoBlock error:", e.message)
                }
            }, 8000) // ⚠️ safe interval
        }

        // 🔥 OFF
        if (state === "off") {

            if (loops[from]) {
                clearInterval(loops[from])
                delete loops[from]
            }

            await sock.sendMessage(from, {
                text: "🛑 AutoBlock désactivé"
            }, { quoted: msg })
        }
    }
}