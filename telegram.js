const TelegramBot = require("node-telegram-bot-api")
const fs = require("fs")
const path = require("path")
const config = require("./config")

const {
    default: makeWASocket,
    useMultiFileAuthState
} = require("@whiskeysockets/baileys")

const bot = new TelegramBot("TON_TOKEN", { polling: true })

const SESSIONS = "./sessions"

// ===== 🔥 TRACK USERS EN COURS =====
const pending = new Set()

// ===== 🔐 CHECK OWNER =====
function isOwner(id) {
    return id === config.OWNER_TELEGRAM_ID
}

// ===== 📊 PANEL AVEC BOUTONS =====
bot.onText(/\/start/, (msg) => {

    if (!isOwner(msg.from.id)) return

    bot.sendMessage(msg.chat.id,
`🤖 *ABESS PANEL*

Choisis une option 👇`,
    {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "👥 Utilisateurs", callback_data: "users" }],
                [{ text: "📊 Stats", callback_data: "stats" }],
                [{ text: "❌ Supprimer User", callback_data: "delete" }]
            ]
        }
    })
})

// ===== 🔥 GESTION BOUTONS =====
bot.on("callback_query", async (query) => {

    if (!isOwner(query.from.id)) return

    const chatId = query.message.chat.id
    const data = query.data

    if (data === "users") {
        const users = fs.existsSync(SESSIONS) ? fs.readdirSync(SESSIONS) : []

        if (users.length === 0) {
            return bot.sendMessage(chatId, "❌ Aucun utilisateur")
        }

        let text = "👥 Utilisateurs :\n\n"
        users.forEach(u => text += `➤ ${u}\n`)

        bot.sendMessage(chatId, text)
    }

    if (data === "stats") {
        const users = fs.existsSync(SESSIONS) ? fs.readdirSync(SESSIONS) : []
        const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)

        bot.sendMessage(chatId,
`📊 Stats

👥 Users: ${users.length}
💾 RAM: ${ram} MB`)
    }

    if (data === "delete") {
        bot.sendMessage(chatId, "❌ Envoie : /delete 2376xxxxxxx")
    }
})

// ===== 📥 AJOUT USER =====
bot.on("message", async (msg) => {

    if (!isOwner(msg.from.id)) return

    const chatId = msg.chat.id
    const text = msg.text

    if (!text || text.startsWith("/")) return

    const number = text.replace(/[^0-9]/g, "")

    if (number.length < 8) {
        return bot.sendMessage(chatId, "❌ Numéro invalide")
    }

    // 🔥 ANTI SPAM
    if (pending.has(number)) {
        return bot.sendMessage(chatId, "⏳ Déjà en cours...")
    }

    // 🔐 LIMIT USERS
    const users = fs.existsSync(SESSIONS) ? fs.readdirSync(SESSIONS) : []

    if (users.length >= config.MAX_USERS) {
        return bot.sendMessage(chatId, "🚫 Limite utilisateurs atteinte")
    }

    const sessionPath = path.join(SESSIONS, number)

    if (!fs.existsSync(sessionPath)) {
        fs.mkdirSync(sessionPath, { recursive: true })
    }

    pending.add(number)

    bot.sendMessage(chatId, "⏳ Génération du code...")

    try {

        const { state, saveCreds } = await useMultiFileAuthState(sessionPath)

        const sock = makeWASocket({
            auth: state
        })

        if (!sock.authState.creds.registered) {
            const code = await sock.requestPairingCode(number)

            bot.sendMessage(chatId,
`🔑 CODE :

${code}

📲 WhatsApp → Lier appareil`)
        } else {
            bot.sendMessage(chatId, "✅ Déjà connecté")
        }

        sock.ev.on("creds.update", saveCreds)

        // 🔥 AUTO CLEAN
        sock.ev.on("connection.update", (update) => {
            if (update.connection === "open") {
                pending.delete(number)
            }

            if (update.connection === "close") {
                pending.delete(number)
            }
        })

    } catch (err) {
        console.log(err)
        pending.delete(number)
        bot.sendMessage(chatId, "❌ Erreur génération code")
    }
})

// ===== 📋 LIST USERS =====
bot.onText(/\/users/, (msg) => {

    if (!isOwner(msg.from.id)) return

    const users = fs.existsSync(SESSIONS) ? fs.readdirSync(SESSIONS) : []

    if (users.length === 0) {
        return bot.sendMessage(msg.chat.id, "❌ Aucun utilisateur")
    }

    let text = "👥 *Utilisateurs :*\n\n"

    users.forEach(u => {
        text += `➤ ${u}\n`
    })

    bot.sendMessage(msg.chat.id, text, { parse_mode: "Markdown" })
})

// ===== ❌ DELETE USER =====
bot.onText(/\/delete (.+)/, (msg, match) => {

    if (!isOwner(msg.from.id)) return

    const num = match[1]
    const sessionPath = path.join(SESSIONS, num)

    if (!fs.existsSync(sessionPath)) {
        return bot.sendMessage(msg.chat.id, "❌ Utilisateur introuvable")
    }

    try {
        fs.rmSync(sessionPath, { recursive: true, force: true })
        pending.delete(num)

        bot.sendMessage(msg.chat.id, `✅ Supprimé: ${num}`)
    } catch {
        bot.sendMessage(msg.chat.id, "❌ Erreur suppression")
    }
})

// ===== 📊 STATS =====
bot.onText(/\/stats/, (msg) => {

    if (!isOwner(msg.from.id)) return

    const users = fs.existsSync(SESSIONS) ? fs.readdirSync(SESSIONS) : []

    const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)

    bot.sendMessage(msg.chat.id,
`📊 *Stats Bot*

👥 Users: ${users.length}
💾 RAM: ${memory} MB
⚡ Status: ONLINE`,
    { parse_mode: "Markdown" })
})