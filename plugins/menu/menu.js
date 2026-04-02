const fs = require("fs")
const path = require("path")

// 🎲 images
const MENU_IMAGES = [
    "https://files.catbox.moe/sqo8qz.jpg",
    "https://files.catbox.moe/pu8o7i.jpg",
    "https://files.catbox.moe/scjy63.jpg",
    "https://files.catbox.moe/y1ua2k.jpg",
    "https://files.catbox.moe/dtar3t.jpg",
    "https://files.catbox.moe/spowl6.jpg"
    ]

module.exports = {
    name: "menu",
    aliases: ["help"],

    async execute(sock, msg) {

        const from = msg.key.remoteJid
        const pushname = msg.pushName || "User"

        // 🔥 réaction
        await sock.sendMessage(from, {
            react: { text: "👾", key: msg.key }
        })

        // 🔥 prefix réel
        let prefix = "."
        try {
            const data = JSON.parse(fs.readFileSync("./database/prefix.json"))
            prefix = data.prefix || "."
        } catch {}

        const owner = process.env.OWNER || "ABESS"

        const pluginsDir = path.join(__dirname, "../../plugins")
        const categories = fs.readdirSync(pluginsDir)

        // 🎲 image random
        const randomImage = MENU_IMAGES[Math.floor(Math.random() * MENU_IMAGES.length)]

        let menu = `
╭━━━〔 🕷𝑨𝑩𝑬𝑺𝑺-𝑴𝑫🕷 〕━━━⬣
┃ 𒆜𝑂𝑤𝑛𝑒𝑟𒆜 : ${owner}
┃ 𒆜𝑃𝑟𝑒𝑓𝑖𝑥𒆜 : ${prefix}
┃ 𒆜𝑈𝑠𝑒𝑟𒆜 : ${pushname}
╰━━━━━━━━━━━━━━━━━━⬣

╭─〔 🕷𝑪𝑨𝑻𝑬𝑮𝑶𝑹𝑰𝑬𝑺🕷 〕⬣
`

        for (const category of categories) {

            const catPath = path.join(pluginsDir, category)

            if (!fs.lstatSync(catPath).isDirectory()) continue

            const desc = "📦 Commandes"

            menu += `┃ ⬡ ${prefix}${category}\n`
        }

        menu += `╰━━━━━━━━━━━━━━━━━━⬣
> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫
`

        // 🔥 NEWSLETTER (AJOUT ICI)
        const contextInfo = {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363408842235507@newsletter",
                newsletterName: "𒆜 𝙰𝚋𝚎𝚜𝚜-𝙼𝙳 𒆜",
                serverMessageId: 1
            }
        }

        // 📤 envoi menu
        await sock.sendMessage(from, {
            image: { url: randomImage },
            caption: menu,
            contextInfo // 🔥 intégré
        }, { quoted: msg })

        // 🔊 audio après
        await sock.sendMessage(from, {
            audio: {
                url: "https://files.catbox.moe/2soagt.mpeg"
            },
            mimetype: "audio/mpeg"
        })
    }
}