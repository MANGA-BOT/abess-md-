// 🚀 ABESS-MD - MONITOR PRO MAX FINAL (CONFIG + CACHE + PERF)

const {
    getGroupSettings,
    addWarning,
    resetWarnings
} = require("../lib/groupSettings")

const fs = require("fs")
const config = require("../config")

const LINK_REGEX = /https?:\/\/|chat\.whatsapp\.com/

// ===== 🔥 CACHE GLOBAL =====
const cache = {
    muted: {},
    badwords: [],
    notag: {},
    warnings: {},
    groupMeta: {},
    lastLoad: 0
}

function loadCache() {
    const now = Date.now()
    if (now - cache.lastLoad < 5000) return

    try {
        cache.muted = JSON.parse(fs.readFileSync(config.DATABASE.MUTED))
    } catch { cache.muted = {} }

    try {
        cache.badwords = JSON.parse(fs.readFileSync(config.DATABASE.BADWORDS)).words || []
    } catch { cache.badwords = [] }

    try {
        cache.notag = JSON.parse(fs.readFileSync(config.DATABASE.NOTAG))
    } catch { cache.notag = {} }

    try {
        cache.warnings = JSON.parse(fs.readFileSync(config.DATABASE.WARNINGS))
    } catch { cache.warnings = {} }

    cache.lastLoad = now
}

// ===== 🔥 GROUP META CACHE =====
async function getGroupMeta(sock, jid) {
    const now = Date.now()

    if (!cache.groupMeta[jid] || now - cache.groupMeta[jid].time > 60000) {
        const meta = await sock.groupMetadata(jid)
        cache.groupMeta[jid] = { data: meta, time: now }
    }

    return cache.groupMeta[jid].data
}

// ===== 🔥 MUTE CHECK =====
function isMuted(group, user) {
    const data = cache.muted

    if (!data[group] || !data[group][user]) return false

    const expire = data[group][user]

    if (Date.now() > expire) {
        delete data[group][user]
        fs.writeFileSync(config.DATABASE.MUTED, JSON.stringify(data, null, 2))
        return false
    }

    return true
}

// ===== 🔥 SPAM TRACK =====
const spamTracker = {}

async function monitorMessage(sock, m) {
    try {
        const msg = m.messages[0]
        if (!msg || !msg.message) return

        loadCache()

        const chatId = msg.key.remoteJid
        if (!chatId.endsWith("@g.us")) return

        const sender = msg.key.participant
        if (!sender) return

        // ===== MUTE =====
        if (isMuted(chatId, sender)) {
            await sock.sendMessage(chatId, { delete: msg.key })
            return
        }
        
        // ===== 🔥 ANTISPAM INTELLIGENT =====
const spamTracker = global.spamTracker || (global.spamTracker = {})

try {

    if (!chatId.endsWith("@g.us")) return

    const metadata = await sock.groupMetadata(chatId)

    // 🔥 vérifier si bot admin
    const botId = sock.user.id.split(":")[0] + "@s.whatsapp.net"
    const botData = metadata.participants.find(p => p.id === botId)
    const isBotAdmin = botData?.admin === "admin" || botData?.admin === "superadmin"

    if (!isBotAdmin) return

    // 🔥 récupérer sender
    const sender = msg.key.participant || msg.key.remoteJid

    // 🔥 ignore admins
    const userData = metadata.participants.find(p => p.id === sender)
    const isAdmin = userData?.admin === "admin" || userData?.admin === "superadmin"

    if (isAdmin) return

    // 🔥 ignore commandes
    const PREFIX = cache.prefix || "."
    if (body.startsWith(PREFIX)) return

    // ===== TRACK =====
    if (!spamTracker[chatId]) spamTracker[chatId] = {}
    if (!spamTracker[chatId][sender]) {
        spamTracker[chatId][sender] = {
            lastMsg: "",
            count: 0,
            warns: 0,
            time: Date.now()
        }
    }

    const data = spamTracker[chatId][sender]

    // 🔥 reset si temps dépassé
    if (Date.now() - data.time > 15000) {
        data.count = 0
        data.lastMsg = ""
    }

    // 🔥 détecte répétition
    if (body === data.lastMsg) {
        data.count++
    } else {
        data.count = 1
        data.lastMsg = body
    }

    data.time = Date.now()

    // ===== WARN =====
    if (data.count >= 5) {

        data.warns++

        const tag = sender.split("@")[0]

        await sock.sendMessage(chatId, {
            text: `⚠️ @${tag} spam détecté (${data.warns}/3)`,
            mentions: [sender]
        })

        data.count = 0

        // ===== MUTE =====
        if (data.warns === 2) {

            if (!cache.muted[chatId]) cache.muted[chatId] = {}

            cache.muted[chatId][sender] = Date.now() + (5 * 60000)

            fs.writeFileSync(config.DATABASE.MUTED, JSON.stringify(cache.muted, null, 2))

            await sock.sendMessage(chatId, {
                text: `🔇 @${tag} mute 5 minutes`,
                mentions: [sender]
            })
        }

        // ===== KICK =====
        if (data.warns >= 3) {

            await sock.groupParticipantsUpdate(chatId, [sender], "remove")

            await sock.sendMessage(chatId, {
                text: `❌ @${tag} expulsé (spam)`,
                mentions: [sender]
            })

            delete spamTracker[chatId][sender]
        }
    }

} catch (e) {
    console.log("Antispam error:", e.message)
}

        // ===== NOTAG =====
        try {
            const group = cache.notag[chatId]
            if (!group) return

            const mentioned =
                msg.message?.extendedTextMessage?.contextInfo?.mentionedJid ||
                msg.message?.imageMessage?.contextInfo?.mentionedJid ||
                msg.message?.videoMessage?.contextInfo?.mentionedJid ||
                []

            const repliedUser =
                msg.message?.extendedTextMessage?.contextInfo?.participant

            const metadata = await getGroupMeta(sock, chatId)

            const admins = metadata.participants
                .filter(p => p.admin !== null)
                .map(p => p.id)

            const isAdmin = admins.includes(sender)

            const owner = config.OWNER + "@s.whatsapp.net"

            if (isAdmin || sender === owner || group.whitelist.includes(sender)) return

            const isMentionBlocked = mentioned.some(u => group.users.includes(u))
            const isReplyBlocked = repliedUser && group.users.includes(repliedUser)

            if (isMentionBlocked || isReplyBlocked) {
                await sock.sendMessage(chatId, { delete: msg.key })

                if (!group.ghost) {
                    await sock.sendMessage(chatId, {
                        text: "🚫 Mention interdite"
                    })
                }

                return
            }
        } catch {}

        // ===== ANTILINK =====
        if (settings.antilink && LINK_REGEX.test(body)) {
            const warn = addWarning(chatId, sender)

            await sock.sendMessage(chatId, {
                text: `⚠️ @${sender.split("@")[0]} lien interdit (${warn}/3)`,
                mentions: [sender]
            })

            await sock.sendMessage(chatId, { delete: msg.key })

            if (warn >= 3) {
                await sock.groupParticipantsUpdate(chatId, [sender], "remove")

                await sock.sendMessage(chatId, {
                    text: `🚫 expulsé`,
                    mentions: [sender]
                })

                resetWarnings(chatId, sender)
            }

            return
        }

        // ===== ANTISPAM =====
        if (settings.antispam && body.length > 1000) {
            await sock.sendMessage(chatId, { delete: msg.key })

            await sock.sendMessage(chatId, {
                text: "🚫 Spam détecté"
            })

            return
        }

    } catch (e) {
        console.log("Monitor error:", e.message)
    }
}

module.exports = { monitorMessage }