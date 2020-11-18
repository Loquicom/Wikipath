// Import
const { ipcMain } = require('electron');
const iphex = require('../helper/iphex');
const ipHex = require('../helper/iphex');

// Join event
ipcMain.on('connection-code', (event, data) => {
    const code = data.code;
    const pseudo = data.pseudo;
    // Check if the code is valid
    if (!iphex.isValid(code)) {
        event.sender.send('invalid-code', code);
        return;
    }
    // If the code is in hex format, decode
    let ip = code;
    if (iphex.isHex(code)) {
        ip = ipHex.decode(code);
    }
    // Wait the answer to be sure the connection is established
    wikipathEvent.once('server-join', (players) => {
        // Inform renderer process
        event.sender.send('connected', players);
    });
    // Send event to join server
    wikipathEvent.emit('connection', ip, pseudo);
});

// Quit event
ipcMain.on('quit-game', () => {
    wikipathEvent.emit('disconnection');
});