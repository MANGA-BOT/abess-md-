const fs = require("fs")

module.exports = {
    name: "reset",
    ownerOnly: true,

    async execute(sock, msg) {
        const from = msg.key.remoteJid

        try {

            // ===== SETTINGS GLOBAL =====
            const defaultSettings = {
                autoread: false,
                autotyping: false,
                autorecord: true,
                presence: "off",

                autostatus: true,
                statusEmoji: "💚",

                anticall: false,
                anticallBlock: false
            }

            fs.writeFileSync(
                "./database/settings.json",
                JSON.stringify(defaultSettings, null, 2)
            )

            // ===== MODE =====
            fs.writeFileSync(
                "./database/mode.json",
                JSON.stringify({ mode: "public" }, null, 2)
            )

            // ===== SUDO =====
            fs.writeFileSync(
                "./database/sudo.json",
                JSON.stringify([], null, 2)
            )

            // ===== WELCOME =====
            fs.writeFileSync(
                "./database/welcome.json",
                JSON.stringify({
                    welcome: {},
                    goodbye: {}
                }, null, 2)
            )

            // ===== GROUP SETTINGS =====
            fs.writeFileSync(
                "./database/groupSettings.json",
                JSON.stringify({}, null, 2)
            )

            // ===== 🔥 AJOUT RESET MUTED =====
            fs.writeFileSync(
                "./database/muted.json",
                JSON.stringify({}, null, 2)
            )

            // ===== 🔥 AJOUT RESET WARNINGS =====
            fs.writeFileSync(
                "./database/warnings.json",
                JSON.stringify({}, null, 2)
            )

            // ===== 🔥 AJOUT RESET BADWORDS =====
            fs.writeFileSync(
                "./database/badwords.json",
                JSON.stringify({ words: [] }, null, 2)
            )

            // ===== 🔥 AJOUT RESET NOTAG =====
            fs.writeFileSync(
                "./database/notag.json",
                JSON.stringify({}, null, 2)
            )

            // ===== 🔥 AJOUT RESET PREFIX =====
            fs.writeFileSync(
                "./database/prefix.json",
                JSON.stringify({ prefix: "." }, null, 2)
            )

            await sock.sendMessage(from, {
                text:
                    "♻️ 𝑹𝑬𝑺𝑬𝑻 𝑪𝑶𝑴𝑷𝑳𝑬𝑻 𝑬𝑭𝑭𝑬𝑪𝑻𝑼𝑬\n\n" +
                    "✅ 𝑆𝑒𝑡𝑡𝑖𝑛𝑔𝑠\n" +
                    "✅ 𝑀𝑜𝑑𝑒\n" +
                    "✅ 𝑆𝑢𝑑𝑜\n" +
                    "✅ 𝑊𝑒𝑙𝑐𝑜𝑚𝑒\n" +
                    "✅ 𝐺𝑟𝑜𝑢𝑝𝑆𝑒𝑡𝑡𝑖𝑛𝑔𝑠\n" +
                    "✅ 𝑀𝑢𝑡𝑒\n" +
                    "✅ 𝑊𝑎𝑟𝑛𝑖𝑛𝑔𝑠\n" +
                    "✅ 𝐵𝑎𝑑𝑊𝑜𝑟𝑑𝑠\n" +
                    "✅ 𝑁𝑜𝑇𝑎𝑔\n" +
                    "✅ 𝑃𝑟𝑒𝑓𝑖𝑥\n\n" +
                    "🥳 𝑩𝒐𝒕 𝒄𝒐𝒎𝒎𝒆 𝒏𝒆𝒖𝒇\n" +
                    "> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫"

            }, { quoted: msg })

        } catch (e) {
            console.log("RESET ERROR:", e)

            await sock.sendMessage(from, {
                text: "❌ 𝑬𝒓𝒓𝒆𝒖𝒓 𝒍𝒐𝒓𝒔 𝒅𝒖 𝒓𝒆𝒔𝒆𝒕"
            }, { quoted: msg })
        }
    }
}