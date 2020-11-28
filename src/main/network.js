/* --- Imports --- */
const Client = require('./wsa/client');
const constant = require('../constant');

/* --- Variables --- */

global.serverConfig = {};
let client = null;

/* --- Functions --- */

function join(ip, pseudo) {
    // New client
    client = new Client(ip, constant.PORT, constant.PROTOCOL_VERSION);
    // Setup client
    setupEvent();
    setupAction();
    // Connection
    client.connect(() => {
        // Register pseudo
        client.send('register', {pseudo: pseudo});
    });
}

function quit() {
    client.send('quit');
    client.close();
}

/* --- Server events --- */
function setupEvent() {
    // Server stop
    client.on('serverstop', () => {
        mainWindow.webContents.send('server-stop'); 
    });
    // Server not found
    client.on('notfound', () => {
        mainWindow.webContents.send('error-not-found');
    });
    // Connection error between server and client
    client.on('error', (err) => {
        mainWindow.webContents.send('error-connection'); 
    });
    // Disconnected by the server
    client.on('disconnection', () => {
        mainWindow.webContents.send('error-disconnection');
    });
    // Broken connection
    client.on('broken', () => {
        mainWindow.webContents.send('error-broken-connection');
    });
    // Bad protocol
    client.on('badprotocol', () => {
        mainWindow.webContents.send('error-bad-protocol');
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
    });
    // Get informations about all other players
    client.action('register', (data) => {
        data.name = serverConfig.name;
        // Client is ready to show lobby
        wikipathEvent.emit('server-join', data);
    });
    // New player join
    client.action('new-player', (data) => {
        mainWindow.webContents.send('new-player', data);
    });
    // Player quit
    client.action('player-quit', (data) => {
        mainWindow.webContents.send('player-quit', data);
    });
    // Ready or not
    client.action('player-ready', (data) => {
        mainWindow.webContents.send('player-ready', data);
    });
    client.action('player-unready', (data) => {
        mainWindow.webContents.send('player-unready', data);
    });
    // Game is loading
    client.action('loading-game', () => {
        mainWindow.webContents.send('loading-game');
    });
    // Game start
    client.action('play', (data) => {
        mainWindow.webContents.send('play', data);
        wikipathEvent.emit('play', data.start.link, data.end.link);
    });
    // Default action
    client.action('default', (data) => {
        quit();
        mainWindow.webContents.send('error-unknown');
    });
}

/* --- Wikipath event --- */

wikipathEvent.on('stop', () => {
    if (client !== null) {
        client.close();
    }
});

wikipathEvent.on('connection', (ip, pseudo) => {
    join(ip, pseudo);
});

wikipathEvent.on('disconnection', () => {
    quit();
});

wikipathEvent.on('ready', () => {
    client.send('ready');
});

wikipathEvent.on('unready', () => {
    client.send('unready');
});