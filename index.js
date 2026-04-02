// 🚀 ABESS-MD - POINT D'ENTRÉE PRO OPTIMISÉ

const fs = require("fs")
const path = require("path")

const { connectToWhatsApp } = require('./core/client')
const { loadPlugins } = require('./core/handler')
const config = require('./config')

// ===== 🔥 DOSSIER SESSIONS =====
const SESSION_PATH = "./sessions"

// ===== 🔥 TRACK SESSIONS ACTIVES =====
const activeSessions = new Set()

// ===== 🔥 ANTI CRASH GLOBAL =====
process.on("uncaughtException", (err) => {
    console.error("💥 Uncaught Exception:", err.message)
})

process.on("unhandledRejection", (err) => {
    console.error("💥 Unhandled Rejection:", err?.message || err)
})

// ===== 🔥 MULTI USER START =====
async function startAllSessions() {
    try {
        if (!fs.existsSync(SESSION_PATH)) {
            fs.mkdirSync(SESSION_PATH)
        }

        const users = fs.readdirSync(SESSION_PATH)

        if (users.length === 0) {
            console.log("⚠️ Aucune session trouvée, en attente de pairing...")
        }

        for (let user of users) {
            const sessionDir = path.join(SESSION_PATH, user)

            // 🔥 éviter double connexion
            if (activeSessions.has(sessionDir)) continue

            try {
                console.log(`🔗 Connexion session: ${user}`)

                activeSessions.add(sessionDir)

                // 🔥 connexion (sans bloquer tout)
                connectToWhatsApp(sessionDir)
                    .then(() => {
                        console.log(`✅ Session active: ${user}`)
                    })
                    .catch(err => {
                        console.error(`❌ Erreur session ${user}:`, err.message)
                        activeSessions.delete(sessionDir) // 🔄 retry possible
                    })

            } catch (err) {
                console.error(`❌ Erreur session ${user}:`, err.message)
                activeSessions.delete(sessionDir)
            }
        }

    } catch (e) {
        console.error("❌ Erreur chargement sessions:", e.message)
    }
}

// ===== 🔥 START =====
async function start() {
    try {
        console.log(`🤖 𝑫𝒆𝒎𝒂𝒓𝒓𝒂𝒈𝒆 𝒅𝒆 ${config.BOT_NAME}...`)

        // 🔥 LOAD PLUGINS
        loadPlugins()

        // 🔥 MULTI SESSION
        await startAllSessions()

    } catch (e) {
        console.error("❌ 𝑬𝒓𝒓𝒆𝒖𝒓 𝒄𝒓𝒊𝒕𝒊𝒒𝒖𝒆:", e.message)

        // 🔥 RESTART AUTO
        setTimeout(() => {
            console.log("🔄 Redémarrage du bot...")
            start()
        }, 5000)
    }
}

// ===== 🔥 AUTO RELOAD NOUVELLE SESSION =====
setInterval(() => {
    startAllSessions()
}, 20000)

// ===== 🔥 KEEP ALIVE =====
setInterval(() => {
    console.log("🟢 Bot actif...")
}, config.KEEP_ALIVE || 30000)

// ===== 🧠 OPTIMISATION RAM =====
setInterval(() => {
    const used = process.memoryUsage().heapUsed / 1024 / 1024

    console.log(`💾 RAM utilisée: ${used.toFixed(2)} MB`)

    // 🔥 nettoyage intelligent
    if (used > 300) {
        console.log("⚠️ Nettoyage mémoire...")
        global.gc && global.gc()
    }

    // 🚨 sécurité
    if (used > 500) {
        console.log("🚨 RAM critique ! Pense à restart VPS")
    }

}, 60000)

// ===== 🔥 WATCH NOUVELLES SESSIONS (ULTRA PRO) =====
fs.watch(SESSION_PATH, (eventType, filename) => {
    if (filename) {
        console.log("📡 Nouvelle session détectée:", filename)
        startAllSessions()
    }
})

// ===== 🔥 LANCEMENT =====
start()