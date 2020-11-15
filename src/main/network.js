/* --- Imports --- */

const { ipcMain } = require('electron');
const Client = require('./server/client');
const constant = require('../constant');

/* --- Variables --- */

global.serverConfig = {};
let client = null;

/* --- Functions --- */

function join(ip, pseudo) {
    // New client
    client = new Client(ip, constant.PORT);
    // Setup client
    setupEvent();
    setupAction();
    // Connection
    client.connect(() => {
        // Register pseudo
        client.send('register', {pseudo: pseudo});
        setTimeout(() => {
            if(client) client.close();
        }, 5000);
    });
}

/* --- Server events --- */
function setupEvent() {
    client.on('error', (err) => {

    });
    
    client.on('broken', () => {
    
    });
}

function setupAction() {
    // Handle error
    client.action('error', (error) => {
        switch(error.code) {
            case 1:
                mainWindow.webContents.send('error-in-game', error.message);
                break;
            case 2:
                mainWindow.webContents.send('error-server-full', error.message);
                break;
            case 3:
                mainWindow.webContents.send('error-unknown-command', error.message);
                break;
            default:
                mainWindow.webContents.send('error-unknown'); 
        }
        client = null;
    });
    // Get the game config from the server
    client.action('config', (config) => {
        // Get config
        serverConfig = config;
        // Client is ready to show lobby
        wikipathEvent.emit('server-join');
    });
}

/* --- Wikipath event --- */

wikipathEvent.on('connection', (ip, pseudo) => {
    join(ip, pseudo);
});