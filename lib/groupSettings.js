const fs = require("fs")

const FILE = "./database/groupSettings.json"

function load() {
    try {
        return JSON.parse(fs.readFileSync(FILE))
    } catch {
        return {}
    }
}

function save(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2))
}

function getGroupSettings(id) {
    const data = load()

    if (!data[id]) {
        data[id] = {
            antilink: false,
            antispam: true,
            welcome: true,
            warnings: {} // 🔥 tracking user
        }
        save(data)
    }

    return data[id]
}

function setGroupSetting(id, key, value) {
    const data = load()

    if (!data[id]) data[id] = {}

    data[id][key] = value
    save(data)
}

function addWarning(id, user) {
    const data = load()

    if (!data[id]) data[id] = { warnings: {} }

    if (!data[id].warnings) data[id].warnings = {}

    if (!data[id].warnings[user]) data[id].warnings[user] = 0

    data[id].warnings[user]++

    save(data)

    return data[id].warnings[user]
}

function resetWarnings(id, user) {
    const data = load()

    if (data[id]?.warnings?.[user]) {
        delete data[id].warnings[user]
        save(data)
    }
}

module.exports = {
    getGroupSettings,
    setGroupSetting,
    addWarning,
    resetWarnings
}