const fs = require("fs")
const path = require("path")

// 🎲 IMAGES
const IMAGES = [
    "https://files.catbox.moe/34an82.jpg",
    "https://files.catbox.moe/spowl6.jpg",
    "https://files.catbox.moe/dtar3t.jpg",
    "https://files.catbox.moe/y1ua2k.jpg"
]

// 🔊 SONS
const SOUNDS = [
    "https://files.catbox.moe/2soagt.mpeg",
    "https://files.catbox.moe/2soagt.mpeg",
    "https://files.catbox.moe/2soagt.mpeg"
]

module.exports = {
    name: "category",

    async execute(sock, msg, args, commandName) {

        const from = msg.key.remoteJid

        // 🔥 NEWSLETTER (AJOUT GLOBAL)
        const contextInfo = {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363408842235507@newsletter",
                newsletterName: "𒆜 𝙰𝚋𝚎𝚜𝚜-𝙼𝙳 𒆜",
                serverMessageId: 1
            }
        }

        // 🔥 prefix réel
        let prefix = "."
        try {
            const data = JSON.parse(fs.readFileSync("./database/prefix.json"))
            prefix = data.prefix || "."
        } catch {}

        const pluginsDir = path.join(__dirname, "../../plugins")
        const categories = fs.readdirSync(pluginsDir)

        const category = (commandName || "").toLowerCase()

        if (!categories.includes(category)) return

        const catPath = path.join(pluginsDir, category)
        const files = fs.readdirSync(catPath).filter(f => f.endsWith(".js"))

        const randomImage = IMAGES[Math.floor(Math.random() * IMAGES.length)]
        const randomSound = SOUNDS[Math.floor(Math.random() * SOUNDS.length)]

        let menu = `
╭━━━〔 🕷𝑨𝑩𝑬𝑺𝑺-𝑴𝑫🕷 〕━━━⬣
┃ 📂 ${category.toUpperCase()}
╰━━━━━━━━━━━━━━━━━━⬣
`

        for (const file of files) {
            try {
                const plugin = require(path.join(catPath, file))
                const cmds = Array.isArray(plugin) ? plugin : [plugin]

                for (const cmd of cmds) {
                    if (cmd.name) {
                        menu += `┃ ⬡ ${prefix}${cmd.name}\n`
                    }
                }

            } catch {}
        }

        menu += `╰━━━━━━━━━━━━━━━━━━⬣`

        // 📤 IMAGE + MENU + NEWSLETTER
        await sock.sendMessage(from, {
            image: { url: randomImage },
            caption: menu,
            contextInfo
        }, { quoted: msg })

        // 🔊 AUDIO + NEWSLETTER (IMPORTANT)
        await sock.sendMessage(from, {
            audio: { url: randomSound },
            mimetype: "audio/mpeg",
            contextInfo
        })
    }
}