const fs = require("fs")

module.exports = {
    name: "autotyping",
    ownerOnly: true,

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const file = "./database/settings.json"

        // 🔥 config par défaut
        let data = {
            autotyping: true,
            autorecord: false,
            autostatus: false,
            presence: "smart"
        }

        // 🔥 lecture sécurisée + merge
        try {
            if (fs.existsSync(file)) {
                const parsed = JSON.parse(fs.readFileSync(file))
                data = { ...data, ...parsed }
            }
        } catch {
            console.log("❌ settings corrompu → reset auto")
        }

        // 🔥 normalisation
        const state = (args[0] || "").toLowerCase()

        if (!["on", "off"].includes(state)) {
            return sock.sendMessage(from, {
                text: "❌ Exemple : .autotyping on/off"
            }, { quoted: msg })
        }

        // 🔥 update
        data.autotyping = state === "on"

        // 🔥 save sécurisé
        try {
            fs.writeFileSync(file, JSON.stringify(data, null, 2))
        } catch {
            return sock.sendMessage(from, {
                text: "❌ Erreur sauvegarde settings"
            }, { quoted: msg })
        }

        // 🔥 réponse propre
        await sock.sendMessage(from, {
            text: `✍️ AutoTyping ${state.toUpperCase()}`
        }, { quoted: msg })
    }
}