const fs = require("fs")
const path = require("path")

// 🎲 IMAGES
const MENU_IMAGES = [
    "https://files.catbox.moe/scjy63.jpg",
    "https://files.catbox.moe/lcn6h8.jpg",
    "https://files.catbox.moe/bytafj.jpg"
]

module.exports = {
    name: "allmenu",
    aliases: ["list"],

    async execute(sock, msg) {

        const from = msg.key.remoteJid
        const pushname = msg.pushName || "User"

        await sock.sendMessage(from, {
            react: { text: "👾", key: msg.key }
        })

        const owner = process.env.OWNER || "ABESS"

        // 🔥 GET REAL PREFIX
        let prefix = "."
        try {
            const data = JSON.parse(fs.readFileSync("./database/prefix.json"))
            prefix = data.prefix || "."
        } catch {
            prefix = "."
        }

        // ⏱ uptime
        const uptime = process.uptime()
        const hours = Math.floor(uptime / 3600)
        const minutes = Math.floor((uptime % 3600) / 60)

        const pluginsDir = path.join(__dirname, "../../plugins")
        const categories = fs.readdirSync(pluginsDir)

        // 🎲 image random
        const randomImage = MENU_IMAGES[Math.floor(Math.random() * MENU_IMAGES.length)]

        let menu = `
╭━━━〔 🕷𝑨𝑩𝑬𝑺𝑺-𝑴𝑫🕷 〕━━━⬣
┃ 𒆜𝑂𝑤𝑛𝑒𝑟𒆜 : ${owner}
┃ 𒆜𝑃𝑟𝑒𝑓𝑖𝑥𒆜 : ${prefix}
┃ 𒆜𝑈𝑝𝑡𝑖𝑚𝑒𒆜 : ${hours}h ${minutes}m
┃ 𒆜𝑈𝑠𝑒𝑟𒆜 : ${pushname}
╰━━━━━━━━━━━━━━━━━━⬣
`

        // 📂 dynamique
        for (const category of categories) {

            const catPath = path.join(pluginsDir, category)

            try {
                if (!fs.lstatSync(catPath).isDirectory()) continue

                const files = fs.readdirSync(catPath).filter(f => f.endsWith(".js"))
                if (files.length === 0) continue

                menu += `\n╭─〔 ${category.toUpperCase()} 〕⬣\n`

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

                menu += `╰──────────────⬣\n`

            } catch {}
        }
        
        
        await sock.sendMessage(from, {
            image: { url: randomImage },
            caption: menu
        }, { quoted: msg })

        // 🔊 audio
        await sock.sendMessage(from, {
            audio: {
                url: "https://files.catbox.moe/2soagt.mpeg"
            },
            mimetype: "audio/mpeg"
        })
    }
}