// Import
const { app, ipcMain } = require('electron');
const iphex = require('../helper/iphex');

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
        ip = iphex.decode(code);
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

// Ready events
ipcMain.on('ready', (event) => {
    wikipathEvent.emit('ready');
});
ipcMain.on('unready', (event) => {
    wikipathEvent.emit('unready');
});

// Get server config event
ipcMain.on('server-config', (event) => {
    event.sender.send('server-config', serverConfig);
});

// Reset webpage event
ipcMain.on('reset', (event, start) => {
    wikipathEvent.emit('reset', start.link);
});

// Information about a webpage
ipcMain.on('information', (event, webpage) => {
    wikipathEvent.emit('information', webpage.link);
});
ipcMain.on('close-information', (event) => {
    wikipathEvent.emit('close-information');
});

// View player history
ipcMain.on('view-history', (event, link) => {
    wikipathEvent.emit('view-history', link);
});
ipcMain.on('change-history', (event, link) => {
    wikipathEvent.emit('change-history', link);
});

// Get players info
ipcMain.on('get-players-info', (event) => {
    wikipathEvent.emit('get-players-info');
});

// Change locale
ipcMain.on('change-locale', (event, locale) => {
    i18n.changeLocale(locale);
    process['application-menu']();
});

// Manage full screen
ipcMain.on('full-screen', (event, toggle) => {
    mainWindow.setFullScreen(toggle);
});

// Quit game
ipcMain.on('quit', (event) => {
    app.quit();
});