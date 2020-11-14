const { app, BrowserView } = require('electron');
const path = require('path');
const events = require('events');
const window = require('./helper/window');
const file = require('./helper/file');

/* --- Squirrel --- */

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

/* --- Initialisation --- */

app.allowRendererProcessReuse = true;
global.wikipathEvent = new events.EventEmitter();

/* --- Functions --- */

function main() {
  loadMainProcessFiles();
  const mainWindow = window.new(path.join(__dirname, 'view/page/menu/index.html'));

  /*
  Gestion de base des fenetres Wikipedia

  const view = new BrowserView()
  mainWindow.setBrowserView(view)
  view.setBounds({ x: 0, y: 0, width: 800, height: 500 })
  view.webContents.on("dom-ready", (event) => {
    // Quand la page est prete (apres toutes les redirections)
    console.log(event.sender.history);
  });
  view.webContents.on('before-input-event', (event, input) => {
    // Empeche de taper au clavier
    event.preventDefault();
  });
  view.webContents.on('will-navigate', (event, url) => {
    // Empeche la navigation par lien
    event.preventDefault();
  });
  view.webContents.loadURL('https://fr.wikipedia.org/wiki/Sp%C3%A9cial:Page_au_hasard')
  */

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
}

function loadMainProcessFiles() {
  const mainProcessFiles = file.list(path.join(__dirname, 'main/'));
  mainProcessFiles.forEach(f => {
    const filepath = path.join(__dirname, 'main/', f)
    if (file.isFile(filepath)) {
      require(filepath);
    }
  });
}

/* --- Electron app actions --- */

// Application ready
app.on('ready', main);
// All window closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
// Re-open
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
// Application stop
app.on('quit', () => {
  console.log('Bye');
  // TODO
});

