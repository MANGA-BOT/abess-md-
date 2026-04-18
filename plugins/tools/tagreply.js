const fs = require("fs")

const FILE = "./database/tagreply.json"

function loadData() {
    if (!fs.existsSync(FILE)) {
        fs.writeFileSync(FILE, JSON.stringify({
            enabled: false,
            type: "text",
            url: "",
            text: "Oui ?"
        }, null, 2))
    }

    return JSON.parse(fs.readFileSync(FILE))
}

function saveData(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2))
}

module.exports = {
    name: "tagreply",
    aliases: ["tr"],
    ownerOnly: true,

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const sub = (args[0] || "").toLowerCase()
        const data = loadData()

        if (!sub) {
            return sock.sendMessage(from, {
                text:
`.tagreply on/off
.tagreply text Votre message
.tagreply image https://url.jpg Message
.tagreply video https://url.mp4 Message
.tagreply sticker https://url.webp
.tagreply status`
            }, { quoted: msg })
        }

        if (sub === "on") {
            data.enabled = true
            saveData(data)
            return sock.sendMessage(from, {
                text: "✅ TagReply activé"
            }, { quoted: msg })
        }

        if (sub === "off") {
            data.enabled = false
            saveData(data)
            return sock.sendMessage(from, {
                text: "❌ TagReply désactivé"
            }, { quoted: msg })
        }

        if (sub === "status") {
            return sock.sendMessage(from, {
                text:
`📌 TagReply

Etat : ${data.enabled ? "ON" : "OFF"}
Type : ${data.type}
URL : ${data.url || "aucune"}
Texte : ${data.text || "aucun"}`
            }, { quoted: msg })
        }

        if (sub === "text") {
            data.type = "text"
            data.text = args.slice(1).join(" ")
            data.url = ""
            saveData(data)
            return sock.sendMessage(from, {
                text: "✅ Réponse texte enregistrée"
            }, { quoted: msg })
        }

        if (sub === "image" || sub === "video" || sub === "sticker") {
            const url = args[1]
            const text = args.slice(2).join(" ")

            if (!url) {
                return sock.sendMessage(from, {
                    text: "❌ URL manquante"
                }, { quoted: msg })
            }

            data.type = sub
            data.url = url
            data.text = text
            saveData(data)

            return sock.sendMessage(from, {
                text: `✅ Réponse ${sub} enregistrée`
            }, { quoted: msg })
        }

        sock.sendMessage(from, {
            text: "❌ Option inconnue"
        }, { quoted: msg })
    }
}
