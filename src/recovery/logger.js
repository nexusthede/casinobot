const fs = require("fs");
const path = require("path");

const LOG_FOLDER = path.join(__dirname, "..", "logs");

if (!fs.existsSync(LOG_FOLDER)) {
    fs.mkdirSync(LOG_FOLDER, { recursive: true });
}

function getLogFile() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return path.join(LOG_FOLDER, `${year}-${month}-${day}.log`);
}

function timestamp() {
    return new Date().toISOString();
}

function write(level, message) {
