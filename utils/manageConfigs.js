const fs = require("fs")

const configPath = "config.json"

let config = {}

if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, "utf-8"))
} else {
    config = { users: {} }
}

function save() {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
}

module.exports = {
    config,
    save
}
