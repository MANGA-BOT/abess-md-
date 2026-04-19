import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, 'config.json');

let config = { users: {} };

try {
    if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
} catch (error) {
    console.error('Erreur chargement config.json :', error);
}

const saveConfig = () => {
    try {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    } catch (error) {
        console.error('Erreur sauvegarde config.json :', error);
    }
};

export default {
    config,

    save() {
        saveConfig();
    }
};
