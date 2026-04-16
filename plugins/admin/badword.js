const fs = require("fs")

module.exports = {
    name: "badword",
    groupOnly: true,
    adminOnly: true,

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const file = "./database/badwords.json"

        let data = { words: [] }

        if (fs.existsSync(file)) {
            data = JSON.parse(fs.readFileSync(file))
        }

        const action = args[0]
        const word = args.slice(1).join(" ").toLowerCase()

        if (!action) {
            return sock.sendMessage(from, {
                text: "❌ .badword add/remove/list mot"
            }, { quoted: msg })
        }

        // ADD
        if (action === "add") {
            if (!word) return

            data.words.push(word)
            fs.writeFileSync(file, JSON.stringify(data, null, 2))

            return sock.sendMessage(from, {
                text: `✅ Mot ajouté : ${word}`
            }, { quoted: msg })
        }

        // REMOVE
        if (action === "remove") {
            data.words = data.words.filter(w => w !== word)

            fs.writeFileSync(file, JSON.stringify(data, null, 2))

            return sock.sendMessage(from, {
                text: `❌ Mot supprimé : ${word}`
            }, { quoted: msg })
        }

        // LIST
        if (action === "list") {
            return sock.sendMessage(from, {
                text: `📋 Mots interdits:\n${data.words.join("\n")}`
            }, { quoted: msg })
        }
    }
}