// 🚀 ABESS-MD - HANDLER PRO MAX (QUEUE + CACHE + ULTRA STABLE)

const fs = require("fs")
const path = require("path")
const chalk = require("chalk")
const config = require("../config")

// 🔥 LOGGER (AJOUT SANS CASSER STRUCTURE)
const log = (...args) => console.log(chalk.cyan("[LOG]"), ...args)
const success = (...args) => console.log(chalk.green("[SUCCESS]"), ...args)
const error = (...args) => console.log(chalk.red("[ERROR]"), ...args)
const warn = (...args) => console.log(chalk.yellow("[WARN]"), ...args)

const plugins = {}
const aliases = {}

// ===== 🔥 CACHE GLOBAL =====
const cache = {
    prefix: config.PREFIXE,
    mode: "public",
    sudo: [],
    lastLoad: 0
}

function loadCache() {
    const now = Date.now()
    if (now - cache.lastLoad < 5000) return

    try {
        cache.prefix = JSON.parse(fs.readFileSync("./database/prefix.json")).prefix || config.PREFIXE
        cache.mode = JSON.parse(fs.readFileSync("./database/mode.json")).mode || "public"
        cache.sudo = JSON.parse(fs.readFileSync("./database/sudo.json")) || []
        cache.lastLoad = now
    } catch {}
}

// ===== 🔥 QUEUE SYSTEM =====
const queue = []
let running = false

async function runQueue() {
    if (running) return
    running = true

    while (queue.length > 0) {
        const job = queue.shift()
        try {
            await job()
        } catch (e) {
            warn("⚠️ Queue error:", e.message)
        }
    }

    running = false
}

function addToQueue(job) {
    queue.push(job)
    runQueue()
}

// ===== LOAD PLUGINS =====
function loadPlugins() {
    console.log(chalk.cyan("📦 𝑪𝒉𝒂𝒓𝒈𝒆𝒎𝒆𝒏𝒕 𝒅𝒆𝒔 𝒑𝒍𝒖𝒈𝒊𝒏𝒔..."))

    const pluginDir = path.join(__dirname, "../plugins")

    if (!fs.existsSync(pluginDir)) fs.mkdirSync(pluginDir)

    const categories = fs.readdirSync(pluginDir)

    categories.forEach(cat => {
        const catPath = path.join(pluginDir, cat)

        if (!fs.lstatSync(catPath).isDirectory()) return

        fs.readdirSync(catPath).forEach(file => {
            if (!file.endsWith(".js")) return

            try {
                const pluginModule = require(path.join(catPath, file))
                const commands = Array.isArray(pluginModule) ? pluginModule : [pluginModule]

                commands.forEach(plugin => {
                    if (!plugin || !plugin.name) return

                    plugins[plugin.name] = plugin

                    if (Array.isArray(plugin.aliases)) {
                        plugin.aliases.forEach(a => aliases[a] = plugin.name)
                    }
                })

            } catch (e) {
                error(`❌ Plugin error: ${file}`, e.message)
            }
        })
    })

    console.log(chalk.green(`✅ ${Object.keys(plugins).length} plugins chargés\n`))
}

// ===== CLEAN NUMBER =====
function cleanNumber(num) {
    if (!num) return ""
    num = num.replace(/[^0-9]/g, "")
    if (num.length > 12) num = num.slice(0, 12)
    return num
}

// ===== GET TEXT =====
function getText(msg) {
    const m = msg.message

    return (
        m?.conversation ||
        m?.extendedTextMessage?.text ||
        m?.imageMessage?.caption ||
        m?.videoMessage?.caption ||
        m?.documentMessage?.caption ||
        m?.buttonsResponseMessage?.selectedButtonId ||
        m?.templateButtonReplyMessage?.selectedId ||
        m?.listResponseMessage?.singleSelectReply?.selectedRowId ||
        ""
    )
}

// ===== HANDLER =====
async function messageHandler(sock, m, PREFIX) {
    try {
        const msg = m.messages[0]
        if (!msg || !msg.message) return

        log("📩 Message reçu:", msg.key.remoteJid)

        loadCache()

        const chatId = msg.key.remoteJid
        const isGroup = chatId.endsWith("@g.us")

        let senderJid = msg.key.fromMe
            ? sock.user.id
            : (isGroup ? (msg.key.participant || msg.participant) : chatId)

        const senderNumber = cleanNumber(senderJid.split("@")[0])
        const ownerClean = cleanNumber(config.OWNER)

        const isOwner = senderNumber === ownerClean || msg.key.fromMe
        const isSudo = cache.sudo.some(n => cleanNumber(n) === senderNumber)

        const body = getText(msg)
        if (!body) return
        
        const mutedFile = "./database/muted.json"

if (fs.existsSync(mutedFile)) {
    const muted = JSON.parse(fs.readFileSync(mutedFile))

    if (muted[chatId] && muted[chatId][senderJid]) {

        // 🔥 utilisateur encore mute
        if (Date.now() < muted[chatId][senderJid]) {
            return
        }

        // 🔥 mute expiré → nettoyage auto
        delete muted[chatId][senderJid]
        fs.writeFileSync(mutedFile, JSON.stringify(muted, null, 2))
    }
}

        log("💬 Texte:", body)

        const prefix = cache.prefix

        if (!body.startsWith(prefix)) return

        if (cache.mode === "private" && !isOwner && !isSudo) return

        const args = body.slice(prefix.length).trim().split(/ +/)
        const cmdName = args.shift()?.toLowerCase()

        let pluginName = plugins[cmdName] ? cmdName : aliases[cmdName]

        if (!pluginName) {
    const categoryPlugin = plugins["category"]

    if (categoryPlugin) {
        return addToQueue(async () => {
            try {
                log("🧠 Exécution: category")

                await categoryPlugin.execute(sock, msg, args, cmdName)

                success("✅ Succès: category")

            } catch (err) {
                error("❌ Plugin error: category →", err.message)
            }
        })
    }

    return
}

        const plugin = plugins[pluginName]

        log(`⚡ CMD: ${pluginName} → ${senderNumber}`)

        // ===== 🔥 EXECUTION VIA QUEUE =====
        addToQueue(async () => {
            try {
                log("🧠 Exécution:", pluginName)

                const originalSend = sock.sendMessage.bind(sock)

                sock.sendMessage = async (jid, content, options = {}) => {

                    const contextInfo = {
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "120363408842235507@newsletter",
                            newsletterName: "𒆜 𝙰𝚋𝚎𝚜𝚜-𝙼𝙳 𒆜",
                            serverMessageId: 1
                        }
                    }

                    content = {
                        ...content,
                        contextInfo: {
                            ...contextInfo,
                            ...(content.contextInfo || {})
                        }
                    }

                    return originalSend(jid, content, options)
                }

                await plugin.execute(sock, msg, args, cmdName, {
                    isOwner,
                    isGroup,
                    isSudo,
                    sudoList: cache.sudo
                })

                sock.sendMessage = originalSend

                success("✅ Succès:", pluginName)

            } catch (err) {
                error("❌ Plugin error:", pluginName, "→", err.message)
            }
        })

    } catch (err) {
        error("💥 Handler error:", err.message)
    }
}

// 🔥 GLOBAL ERROR HANDLER
process.on("uncaughtException", (err) => {
    console.log(chalk.red("💥 CRASH GLOBAL:"), err)
})

process.on("unhandledRejection", (err) => {
    console.log(chalk.yellow("⚠️ PROMISE ERROR:"), err)
})

module.exports = { loadPlugins, messageHandler }