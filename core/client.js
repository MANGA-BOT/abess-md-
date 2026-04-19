// 🚀 𝘼𝘽𝙀𝙎𝙎-𝙈𝘿 - CLIENT OPTIMISÉ PRO FINAL


require("dotenv").config()

const {
    makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    DisconnectReason
} = require("@whiskeysockets/baileys")



const pino = require("pino")
const fs = require("fs")
const chalk = require("chalk")
const readline = require("readline")



const config = require("../config")
const { messageHandler } = require("./handler")
const { getMediaBuffer } = require("../lib/media")
const { monitorMessage } = require("./monitor")
const WARN_FILE = "./database/warn.json"
const respondPlugin = require("../../plugins/group/respond")


// ===== 🔥 CACHE GLOBAL =====
const groupCache = new Map()



// ===== 🔥 FONCTION CACHE =====
async function getGroupData(sock, jid) {



    if (groupCache.has(jid)) {
        return groupCache.get(jid)
    }



    const metadata = await sock.groupMetadata(jid)



    const data = {
        subject: metadata.subject,
        participants: metadata.participants.length
    }



    groupCache.set(jid, data)



    // refresh auto après 60 sec
    setTimeout(() => groupCache.delete(jid), 60000)



    return data
}
const cache = {
    settings: {},
    prefix: ".",
    antidelete: true,
    welcome: {},
    lastLoad: 0
}



function loadCache() {
    const now = Date.now()
    if (now - cache.lastLoad < 5000) return



    try {
        cache.settings = JSON.parse(fs.readFileSync("./database/settings.json"))
        cache.prefix = JSON.parse(fs.readFileSync("./database/prefix.json")).prefix
        cache.antidelete = JSON.parse(fs.readFileSync("./database/antidelete.json")).enabled
        cache.welcome = JSON.parse(fs.readFileSync("./database/welcome.json"))
        cache.lastLoad = now
    } catch {}
}



// ===== 🔥 QUEUE MONITOR =====
const monitorQueue = []
let monitorRunning = false



async function runMonitorQueue() {
    if (monitorRunning) return
    monitorRunning = true



    while (monitorQueue.length > 0) {
        const job = monitorQueue.shift()
        try {
            await job()
        } catch (e) {
            console.log("Monitor Queue error:", e.message)
        }
    }



    monitorRunning = false
}



function addMonitor(job) {
    monitorQueue.push(job)
    runMonitorQueue()
}



// ===== 🔥 SIGNATURE =====
const SIGNATURE = "\n> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫"



// ===== 🔥 ANTI DUPLICATE =====
const processedMessages = new Set()



// ===== 🔥 STORE LIMITÉ =====
const messageStore = new Map()



// ===== 🔥 TERMINAL =====
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})



// ===== 🔥 ANTI ANCIENS =====
function isRecent(msg) {
    const now = Date.now()
    const msgTime = msg.messageTimestamp * 1000
    return (now - msgTime) < 15000
}



// ===== MAIN =====
async function connectToWhatsApp(sessionPath = config.SESSION_NAME) {
    const { version } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath)



    const sock = makeWASocket({
        version,
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }))
        }
    })



    // ===== 🔥 PAIRING CODE =====
    if (!state.creds.registered && sessionPath === config.SESSION_NAME) {
        const pairNumber = process.env.PAIR_NUMBER

        if (!pairNumber) {
            console.log("❌ PAIR_NUMBER manquant dans le .env")
        } else {
            setTimeout(async () => {
                try {
                    const clean = pairNumber.replace(/[^0-9]/g, "")
                    const code = await sock.requestPairingCode(clean)
                    console.log(`\n🔑 CODE : ${code}\n`)
                } catch (err) {
                    console.log("❌ Pairing error:", err)
                }
            }, 2000)
        }
    }



    // ===== 🔥 SAFE SEND =====
    const originalSendMessage = sock.sendMessage
    sock.sendMessage = async (jid, content, options = {}) => {
        try {
            if (content?.text && !content.text.includes("𝑷𝒐𝒘𝒆𝒓𝒆𝒅")) {
                content.text += SIGNATURE
            }



            if (content?.caption && !content.caption.includes("𝑷𝒐𝒘𝒆𝒓𝒆𝒅")) {
                content.caption += SIGNATURE
            }



            return await originalSendMessage(jid, content, options)
        } catch (err) {
            console.log("⚠️ SendMessage failed:", err.message)
            return null
        }
    }



    sock.ev.on("creds.update", saveCreds)



    // ===== ANTICALL =====
    sock.ev.on("call", async (callData) => {
        loadCache()



        if (!cache.settings.anticall) return



        for (const call of callData) {
            try {
                const caller = call.from



                await sock.sendMessage(caller, {
                    text: "🚫 Les appels ne sont pas autorisés"
                })



                await sock.rejectCall(call.id, call.from)



                if (cache.settings.anticallBlock) {
                    await sock.updateBlockStatus(caller, "block")
                }
            } catch {}
        }
    })



    // ===== CONNECTION =====
    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update



        if (connection === "open") {
            console.log(chalk.green("✅ BOT CONNECTÉ"))



            try {
                const userId = sock.user.id.split(":")[0] + "@s.whatsapp.net"



                await sock.sendMessage(userId, {
                    image: { url: "https://files.catbox.moe/34an82.jpg" },
                    caption: `🤖 BOT CONNECTÉ AVEC SUCCÈS\n\nTape .menu pour commencer`
                })
            } catch {}
        }
        
        // ===== 🔥 AUTOBLOCK LOOP FIX =====
        
        if (connection === "close") {
            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut



            if (shouldReconnect) {
                console.log("🔄 Reconnexion rapide...")
                setTimeout(() => connectToWhatsApp(sessionPath), config.RECONNECT_DELAY || 5000)
            }
        }
    })



    // ===== MESSAGES =====
    sock.ev.on("messages.upsert", async (m) => {
        const msg = m.messages?.[0]
        if (!msg || !msg.message) return



        loadCache()



        const chatId = msg.key.remoteJid



        if (!isRecent(msg)) return



        const msgId = msg.key.id
        if (processedMessages.has(msgId)) return



        processedMessages.add(msgId)
        if (processedMessages.size > 500) processedMessages.clear()



        if (cache.settings.autoread) {
            sock.readMessages([msg.key]).catch(() => {})
        }



        if (msg.key?.id) {
            messageStore.set(msg.key.id, msg)



            if (messageStore.size > 200) {
                const first = messageStore.keys().next().value
                messageStore.delete(first)
            }
        }



        const body =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            msg.message.imageMessage?.caption ||
            msg.message.videoMessage?.caption ||
            ""

          // ===== AUTO TAG RESPOND =====
try {
    const lid =
        msg.message?.extendedTextMessage?.contextInfo?.mentionedJid ||
        msg.message?.imageMessage?.contextInfo?.mentionedJid ||
        msg.message?.videoMessage?.contextInfo?.mentionedJid ||
        []

    await respondPlugin.respondAuto(msg, sock, lid)

} catch (e) {
    console.log("RESPOND PLUGIN ERROR:", e.message)
}

      const fs = require("fs")

try {
    const FILE = "./database/tagreply.json"

    if (fs.existsSync(FILE)) {
        const data = JSON.parse(fs.readFileSync(FILE))

        if (data.enabled) {

            const msg = m.messages[0]
            const from = msg.key.remoteJid
            const isGroup = from.endsWith("@g.us")

            if (isGroup) {
                const mentions =
                    msg.message?.extendedTextMessage?.contextInfo?.mentionedJid ||
                    msg.message?.imageMessage?.contextInfo?.mentionedJid ||
                    msg.message?.videoMessage?.contextInfo?.mentionedJid ||
                    []

                const myId = sock.user.id.split(":")[0] + "@s.whatsapp.net"

                if (mentions.includes(myId)) {

                    if (data.type === "text") {
                        await sock.sendMessage(from, {
                            text: data.text
                        }, { quoted: msg })

                    } else if (data.type === "image") {
                        await sock.sendMessage(from, {
                            image: { url: data.url },
                            caption: data.text
                        }, { quoted: msg })

                    } else if (data.type === "video") {
                        await sock.sendMessage(from, {
                            video: { url: data.url },
                            caption: data.text
                        }, { quoted: msg })

                    } else if (data.type === "sticker") {
                        await sock.sendMessage(from, {
                            sticker: { url: data.url }
                        }, { quoted: msg })
                    }
                }
            }
        }
    }
} catch (e) {
    console.log("TAGREPLY ERROR:", e.message)
          }


        // 🔥 MONITOR EN QUEUE
        addMonitor(async () => {
            await monitorMessage(sock, m)
        })



        const PREFIX = cache.prefix



        if (!body.startsWith(PREFIX)) return



        sock.sendMessage(chatId, {
            react: { text: "⚡", key: msg.key }
        }).catch(() => {})



        try {
            // 🔥 PAS DE await (handler a déjà queue)
            await messageHandler(sock, m, PREFIX)



            sock.sendMessage(chatId, {
                react: { text: "✅", key: msg.key }
            }).catch(() => {})



        } catch (err) {
            console.log("❌ Handler error:", err.message)



            sock.sendMessage(chatId, {
                react: { text: "❌", key: msg.key }
            }).catch(() => {})
        }
    })



// ===== ANTI DELETE =====
sock.ev.on("messages.update", async (updates) => {



    let antidel = false
    try {
        antidel = JSON.parse(fs.readFileSync(config.DATABASE.ANTIDELETE)).enabled
    } catch {}



    if (!antidel) return



    for (const u of updates) {
        try {
            const protocol = u.update?.protocolMessage
            if (!protocol || protocol.type !== 0) continue



            const deletedKey = protocol.key
            const deletedMsg = messageStore.get(deletedKey.id)
            if (!deletedMsg) continue



            const chatId = deletedKey.remoteJid
            const who = (deletedKey.participant || chatId).split("@")[0]



            const media = await getMediaBuffer(sock, deletedMsg)



            if (media) {
                await sock.sendMessage(chatId, {
                    image: media.buffer,
                    caption: `🗑️ @${who} a supprimé un message`
                })
            } else {
                await sock.sendMessage(chatId, {
                    text: `🗑️ @${who} a supprimé un message`
                })
            }
        } catch {}
    }
})
    
    // ===== 🔒 LOCK GROUP (ANTI MODIFICATION) =====
sock.ev.on("groups.update", async (updates) => {
    try {



        const file = "./database/lockgc.json"
        if (!fs.existsSync(file)) return



        const data = JSON.parse(fs.readFileSync(file))



        for (const update of updates) {



            const jid = update.id



            if (!data[jid]) continue



            const metadata = await sock.groupMetadata(jid)



            // 🔥 reset nom
            if (update.subject) {
                await sock.groupUpdateSubject(jid, metadata.subject)
            }



            // 🔥 reset description
            if (update.desc) {
                await sock.groupUpdateDescription(jid, metadata.desc || "")
            }



            // 🔥 reset paramètres groupe
            if (update.announce !== undefined) {
                await sock.groupSettingUpdate(jid, update.announce ? "announcement" : "not_announcement")
            }



            if (update.restrict !== undefined) {
                await sock.groupSettingUpdate(jid, update.restrict ? "locked" : "unlocked")
            }



            console.log("🔒 LOCKGC actif sur:", jid)
        }



    } catch (e) {
        console.log("LOCKGC ERROR:", e.message)
    }
})
    
    // ===== WELCOME + ANTIPROMOTE =====
sock.ev.on("group-participants.update", async (update) => {
    loadCache()



    try {
        
        // 🔒 LOCKGC anti promote/demote
const lockFile = "./database/lockgc.json"



if (fs.existsSync(lockFile)) {
    const lockData = JSON.parse(fs.readFileSync(lockFile))



    if (lockData[update.id]) {
        if (update.action === "promote") {
            await sock.groupParticipantsUpdate(update.id, update.participants, "demote")
        }
        if (update.action === "demote") {
            await sock.groupParticipantsUpdate(update.id, update.participants, "promote")
        }
    }
}



        // ===== 🔥 ANTIPROMOTE + WARN =====
const antiPromoteFile = "./database/antipromote.json"



if (fs.existsSync(antiPromoteFile)) {
    const data = JSON.parse(fs.readFileSync(antiPromoteFile))



    if (data?.[update.id] && update.action === "promote") {



        let warns = {}



        if (fs.existsSync(WARN_FILE)) {
            warns = JSON.parse(fs.readFileSync(WARN_FILE))
        }



        if (!warns[update.id]) warns[update.id] = {}



        for (let user of update.participants) {



            await sock.groupParticipantsUpdate(update.id, [user], "demote")



            // ➕ warn
            warns[update.id][user] = (warns[update.id][user] || 0) + 1
            const count = warns[update.id][user]



            const tag = user.split("@")[0]



            // 💾 sauvegarde
            fs.writeFileSync(WARN_FILE, JSON.stringify(warns, null, 2))



            // ⚠️ message (1 seule fois par action)
            await sock.sendMessage(update.id, {
                text: `🚫 @${tag} promotion refusée !



⚠️ Avertissement: ${count}/3
⛔ AntiPromote actif`,
                mentions: [user]
            })



            console.log(`⚠️ Warn ${count}:`, user)



            // 💥 KICK SI 3
            if (count >= 3) {



                await sock.groupParticipantsUpdate(update.id, [user], "remove")



                await sock.sendMessage(update.id, {
                    text: `❌ @${tag} expulsé !



🚫 3 avertissements atteints`,
                    mentions: [user]
                })



                // reset
                warns[update.id][user] = 0
                fs.writeFileSync(WARN_FILE, JSON.stringify(warns, null, 2))



                console.log("💥 KICK:", user)
            }
        }
    }
}
        // ===== 🔥 ANTIDEMOTE =====
        const antiDemoteFile = "./database/antidemote.json"



        if (fs.existsSync(antiDemoteFile)) {
            const data = JSON.parse(fs.readFileSync(antiDemoteFile))



            if (data?.[update.id] && update.action === "demote") {



                for (let user of update.participants) {



                    await sock.groupParticipantsUpdate(update.id, [user], "promote")



                    const tag = user.split("@")[0]



                    await sock.sendMessage(update.id, {
                        text: `🚫 @${tag} ne peut pas être retiré admin !



⚠️ AntiDemote actif`,
                        mentions: [user]
                    })
                }
            }
        }



        // ===== 🔥 WELCOME / GOODBYE =====
        for (const user of update.participants) {



            const tag = user.split("@")[0]



            let pp = "https://files.catbox.moe/34an82.jpg"



            try {
                pp = await sock.profilePictureUrl(user, "image")
            } catch {}
            
            if (update.action === "add" && cache.welcome.welcome?.[update.id]) {



    const data = await getGroupData(sock, update.id)



    const groupName = data.subject
    const totalMembers = data.participants
    const now = new Date().toLocaleString()



    await sock.sendMessage(update.id, {
        image: { url: pp },
        caption: `
╭━━━〔 🕷 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 🕷 〕━━━⬣
┃ 🕷➤ Utilisateur : @${tag}
┃ 🕷➤ Groupe : ${groupName}
┃ 🕷➤ Membres : ${totalMembers}
┃ 🕷➤ Date : ${now}
┃ 🕷➤ Bienvenue dans le groupe 🚀
┃ 🕷➤ Respecte les règles ⚠️
╰━━━〔 𒆜𝚊𝚋𝚎𝚜𝚜-𝚖𝚍𒆜 〕━━━⬣
`,
        mentions: [user]
    })
}
        if (update.action === "remove" && cache.welcome.goodbye?.[update.id]) {



    const data = await getGroupData(sock, update.id)



    const groupName = data.subject
    const totalMembers = data.participants
    const now = new Date().toLocaleString()



    await sock.sendMessage(update.id, {
        image: { url: pp },
        caption: `
╭━━━〔 🕷 𝐆𝐎𝐎𝐃𝐁𝐘𝐄 🕷 〕━━━⬣
┃ 🕷➤ @${tag}
┃ 🕷➤ ${groupName}
┃ 🕷➤ Membres : ${totalMembers}
┃ 🕷➤ ${now}
╰━━━〔 𒆜𝚊𝚋𝚎𝚜𝚜-𝚖𝚍𒆜 〕━━━⬣
`,
        mentions: [user]
    })
}
        }



    } catch (e) {
        console.log("Group update error:", e.message)
    }
})



    return sock
}



module.exports = { connectToWhatsApp }
