// Import
const { ipcMain } = require('electron');
const iphex = require('../helper/iphex');
const ipHex = require('../helper/iphex');

// Join event
ipcMain.on('connection-code', (event, code) => {
    // Check if the code is valid
    if (!iphex.isValid(code)) {
        event.sender.send('invalid-code', code);
    }
    // If the code is in hex format, decode
    let ip = code;
    if (iphex.isHex(code)) {
        ip = ipHex.decode(code);
    }
    // Inform renderer process
    event.sender.send('connection');
});