const fs = require("fs")

const cache = {
    data: {},
    lastLoad: {}
}

function load(file, def = {}) {
    const now = Date.now()

    if (!cache.lastLoad[file] || now - cache.lastLoad[file] > 5000) {
        try {
            cache.data[file] = JSON.parse(fs.readFileSync(file))
            cache.lastLoad[file] = now
        } catch {
            cache.data[file] = def
        }
    }

    return cache.data[file]
}

module.exports = { load }