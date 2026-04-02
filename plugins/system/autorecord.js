const fs = require("fs")

module.exports = {
    name: "autorecord",
    ownerOnly: true,

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const file = "./database/settings.json"

        // 🔥 config par défaut
        let data = {
            autotyping: true,
            autorecord: false,
            presence: "smart"
        }

        // 🔥 lecture safe
        try {
            if (fs.existsSync(file)) {
                const raw = fs.readFileSync(file)
                data = JSON.parse(raw)
            }
        } catch (e) {
            console.log("❌ settings.json corrompu → reset auto")
        }

        // 🔥 normalisation input
        const state = (args[0] || "").toLowerCase()

        if (!["on", "off"].includes(state)) {
            return sock.sendMessage(from, {
                text: `❌ Exemple: .autorecord on/off`
            }, { quoted: msg })
        }

        // 🔥 update
        data.autorecord = state === "on"

        // 🔥 écriture safe
        try {
            fs.writeFileSync(file, JSON.stringify(data, null, 2))
        } catch (e) {
            return sock.sendMessage(from, {
                text: "❌ Erreur sauvegarde settings"
            }, { quoted: msg })
        }

        // 🔥 réponse propre
        await sock.sendMessage(from, {
            text: `🎤 AutoRecord est maintenant ${state.toUpperCase()}`
        }, { quoted: msg })
    }
}