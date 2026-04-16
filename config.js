// ⚙️ ABESS-MD - CONFIGURATION PRO MAX FINAL

require('dotenv').config();

// ===== 🔥 CACHE ENV =====
const ENV = process.env;

// ===== 🔥 CLEAN NUMBER =====
function cleanNumber(num) {
  if (!num) return "";
  return num.replace(/[^0-9]/g, "");
}

// ===== 🔥 OWNER PRINCIPAL =====
const OWNER = cleanNumber(ENV.OWNER || '237682229367');

// ===== 🔥 MULTI OWNER =====
const OWNER_LIST = (ENV.OWNER || '237682229367')
  .split(',')
  .map(n => cleanNumber(n))
  .filter(Boolean);

// ===== 🔥 EXPORT CONFIG =====
module.exports = {

  // ===== IDENTITÉ =====
  BOT_NAME: ENV.BOT_NAME || 'ABESS-MD',
  OWNER_NAME: ENV.OWNER_NAME || 'Owner',

  // ===== OWNER =====
  OWNER,
  OWNER_LIST,

  // ===== PREFIX =====
  PREFIXE: ENV.PREFIXE || '.',

  // ===== CONNEXION =====
  SESSION_NAME: ENV.SESSION_NAME || './auth',

  // ===== NUMÉRO PRINCIPAL =====
  PHONE_NUMBER: OWNER,

  // ===== MODE =====
  MODE: ENV.MODE || 'private',

  // ===== PARAMÈTRES =====
  AUTO_READ: ENV.AUTO_READ === 'true',

  // ===== 🔥 TELEGRAM (AJOUT SAFE) =====
  TELEGRAM_BOT_TOKEN: ENV.TELEGRAM_BOT_TOKEN || "",
  OWNER_TELEGRAM_ID: Number(ENV.OWNER_TELEGRAM_ID) || 0,

  // ===== 🔥 LIMIT MULTI-USER =====
  MAX_USERS: Number(ENV.MAX_USERS) || 50,

  // ===== 🔥 SÉCURITÉ =====
  ANTISPAM: ENV.ANTISPAM !== 'false', // actif par défaut
  ANTI_BAN: ENV.ANTI_BAN !== 'false',

  // ===== 🔥 OPTIMISATION =====
  RECONNECT_DELAY: Number(ENV.RECONNECT_DELAY) || 5000,
  KEEP_ALIVE: Number(ENV.KEEP_ALIVE) || 30000,

  // ===== 🔥 RAM CONTROL =====
  MAX_RAM_MB: Number(ENV.MAX_RAM_MB) || 500,
  AUTO_CLEAR_RAM: ENV.AUTO_CLEAR_RAM !== 'false',

  // ===== BASE DE DONNÉES (CENTRALISÉE 🔥) =====
  DATABASE: {
    USERS: './database/users.json',
    GROUPS: './database/groups.json',

    SETTINGS: './database/settings.json',
    MODE: './database/mode.json',
    PREFIX: './database/prefix.json',

    ANTIDELETE: './database/antidel.json',
    SUDO: './database/sudo.json',

    // 🔥 AJOUTS IMPORTANTS
    BADWORDS: './database/badwords.json',
    MUTED: './database/muted.json',
    WARNINGS: './database/warnings.json',
    NOTAG: './database/notag.json',
    WELCOME: './database/welcome.json',

    // ===== 🔥 NOUVEAUX FICHIERS SAFE =====
    LOCKGC: './database/lockgc.json',
    ANTIPROMOTE: './database/antipromote.json',
    ANTIDEMOTE: './database/antidemote.json',
    AUTOBLOCK: './database/autoblock.json'
  }

};