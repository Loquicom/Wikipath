// Imports
const { BrowserView } = require('electron');
const Entities = require('html-entities').AllHtmlEntities;
const path = require('path');
const window = require('./service/window');

// Variables
const entite = new Entities();
let checkInterval;
let informationWindow;
let historyWindow;
const urls = {
    start: '',
    end: ''
};

// Functions
function getSize(win) {
    const size = mainWindow.getSize();
    return {width: size[0], height: size[1]};
}

function checkUrl(urls, endUrl, history) {
    if (urls.indexOf(decodeURIComponent(endUrl)) !== -1) {
        finish(history);
    }
}

function finish(historyLink) {
    // Clear interval
    clearInterval(checkInterval);
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
        const splitLink = link.split('/');
        let title = splitLink.pop();
        if (!title) {
            title = splitLink.pop();
        }
        title = entite.encode(decodeURIComponent(title).replaceAll('_', ' '));
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
    urls.start = startUrl;
    urls.end = endUrl;
    // Create browser vien in the main window
    const view = new BrowserView();
    mainWindow.setBrowserView(view);
    // Set the correct size
    let size = getSize(mainWindow);
    view.setBounds({ x: 0, y: 100, width: size.width, height: size.height - 100 });
    // Check if the player find the end page
    view.webContents.on("dom-ready", (event) => {
        const urls = [decodeURIComponent(event.sender.history[event.sender.history.length - 1])];
        // Attend toutes les redirections
        setTimeout(() => {
            urls.push(decodeURIComponent(view.webContents.getURL()));
            checkUrl(urls, endUrl, event.sender.history);
        }, 1000);       
    });
    view.webContents.on('will-navigate', (event, url) => {
        checkUrl([decodeURIComponent(url)], endUrl, view.webContents.history);
    });
    checkInterval = setInterval(() => {
        checkUrl([decodeURIComponent(view.webContents.getURL())], endUrl, view.webContents.history);
    }, 2500);
    // Prevent keyboard input
    view.webContents.on('before-input-event', (event, input) => {
        event.preventDefault();
    });
    // Disables the possibility to open new windows with the middle click
    view.webContents.on('new-window', function (event, url) {
        event.preventDefault()
    });
    // Load the start URL
    view.webContents.loadURL(startUrl);
    // Resize the Browser view
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
        // Prevent keyboard input
        view.webContents.on('before-input-event', (event, input) => {
            event.preventDefault();
        });
        // Prevent navigation with a link
        view.webContents.on('will-navigate', (event, url) => {
            event.preventDefault();
        });
        // Disables the possibility to open new windows with the middle click
        view.webContents.on('new-window', function (event, url) {
            event.preventDefault()
        });
        // Resize the Browser view
        informationWindow.on('resize', () => {
            size = getSize(mainWindow);
            view.setBounds({ x: 0, y: 0, width: size.width, height: size.height });
        });
    }
    // When information window is close set to null
    informationWindow.on('close', () => {
        informationWindow = null;
    });
});

wikipathEvent.on('konami-code', () => {
    const view = mainWindow.getBrowserView();
    if (!view) {
        return false;
    }
    const history = view.webContents.history;
    history.push(_('app.konamiCode'));
    history.push(urls.end);
    finish(history);
});

wikipathEvent.on('view-history', (link) => {
    // Load Browser view on first page
    historyWindow = window.new(path.join(__dirname, '../view/page/history/index.html'), window.defaultValues.width - 10, window.defaultValues.height - 100, mainWindow);
    historyWindow.removeMenu();
    const view = new BrowserView();
    historyWindow.setBrowserView(view);
    let size = getSize(historyWindow);
    view.setBounds({ x: 0, y: 150, width: size.width, height: size.height - 150 });
    view.webContents.loadURL(link);
    // Prevent keyboard input
    view.webContents.on('before-input-event', (event, input) => {
        event.preventDefault();
    });
    // Prevent navigation with a link
    view.webContents.on('will-navigate', (event, url) => {
        event.preventDefault();
    });
    // Disables the possibility to open new windows with the middle click
    view.webContents.on('new-window', function (event, url) {
        event.preventDefault()
    });
    // Resize the Browser view
    historyWindow.on('resize', () => {
        size = getSize(mainWindow);
        view.setBounds({ x: 0, y: 150, width: size.width, height: size.height - 150 });
    });
    // When history window is close set to null
    historyWindow.on('close', () => {
        historyWindow = null;
    });
});

wikipathEvent.on('change-history', (link) => {
    if (!historyWindow) {
        return;
    }
    historyWindow.getBrowserView().webContents.loadURL(link);
});

wikipathEvent.on('close-information', () => {
    if (!informationWindow) {
        return;
    }
    informationWindow.close();
});

wikipathEvent.on('stop-browser', () => {
    urls.start = '';
    urls.end = '';
    clearInterval(checkInterval);
    if (informationWindow) {
        informationWindow.close();
    }
    if (historyWindow) {
        historyWindow.close();
    }
    const view = mainWindow.getBrowserView();
    if (view) {
        mainWindow.removeBrowserView(view);
    }
});