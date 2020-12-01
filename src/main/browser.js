// Imports
const { BrowserView } = require('electron');
const path = require('path');
const window = require('./service/window');

// Variables
let informationWindow;

// Functions
function getSize(win) {
    const size = mainWindow.getSize();
    return {width: size[0], height: size[1]};
}

function finish(historyLink) {
    // Close information window
    if (informationWindow) {
        informationWindow.close();
    }
    // Remove browser view and show loader
    mainWindow.removeBrowserView(mainWindow.getBrowserView());
    mainWindow.webContents.send('waiting-players');
    // Transform history
    const history = [];
    for (let link of historyLink) {
        const title = decodeURI(link.split('/').pop()).replaceAll('_', ' ');
        history.push({
            title: title,
            link: link
        });
    }
    // Send to server
    wikipathEvent.emit('finish', history);
}

// Events
wikipathEvent.on('play', (startUrl, endUrl) => {
    // Create browser vien in the main window
    const view = new BrowserView();
    mainWindow.setBrowserView(view);
    // Set the correct size
    let size = getSize(mainWindow);
    view.setBounds({ x: 0, y: 100, width: size.width, height: size.height - 100 });
    // Check if the player find the end page
    view.webContents.on("dom-ready", (event) => {
        const urls = [event.sender.history[event.sender.history.length - 1]];
        // Attend toutes les redirections
        setTimeout(() => {
            urls.push(view.webContents.getURL());
            if (urls.indexOf(endUrl) !== -1) {
                finish(event.sender.history);
            }
        }, 1000);       
    });
    // Load the start URL
    view.webContents.loadURL(startUrl);
    // Resize window
    mainWindow.on('resize', () => {
        size = getSize(mainWindow);
        view.setBounds({ x: 0, y: 100, width: size.width, height: size.height - 100 });
    });
});

wikipathEvent.on('reset', (url) => {
    const view = mainWindow.getBrowserView();
    view.webContents.clearHistory();
    view.webContents.loadURL(url);
});

wikipathEvent.on('information', (url) => {
    // If information window is not already open
    if (informationWindow) {
        return;
    }
    // Create new window to display information
    informationWindow = window.new(path.join(__dirname, '../view/page/information/index.html'), window.defaultValues.width - 10, window.defaultValues.height - 100, mainWindow);
    informationWindow.removeMenu();
    if (serverConfig.fullPage) {
        // Create a browser view
        const view = new BrowserView();
        informationWindow.setBrowserView(view);
        let size = getSize(mainWindow);
        view.setBounds({ x: 0, y: 0, width: size.width, height: size.height });
        view.webContents.loadURL(url);
        informationWindow.on('resize', () => {
            size = getSize(mainWindow);
            view.setBounds({ x: 0, y: 0, width: size.width, height: size.height });
        });
        view.webContents.on('before-input-event', (event, input) => {
            // Prevent keyboard input
            event.preventDefault();
        });
        view.webContents.on('will-navigate', (event, url) => {
            // Prevent navigation with a link
            event.preventDefault();
        });
    }
    // When informationWindow is close set to null
    informationWindow.on('close', () => {
        informationWindow = null;
    });
});

wikipathEvent.on('close-information', () => {
    if (!informationWindow) {
        return;
    }
    informationWindow.close();
});