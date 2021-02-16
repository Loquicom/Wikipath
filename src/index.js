const { app } = require('electron');
const path = require('path');
const events = require('events');
const window = require('./main/service/window');
const file = require('./helper/file');
const i18nFactory = require('./helper/i18n');

/* --- Squirrel --- */

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

/* --- Initialisation --- */

app.allowRendererProcessReuse = true;
global.wikipathEvent = new events.EventEmitter();
global.mainWindow = null;
global.devMode = process.argv.length > 2 && process.argv[2] === '--dev';
global.i18n = i18nFactory.create(path.join(__dirname, '../locales'));
global._ = i18n._.bind(i18n);
global.process = [];

/* --- Functions --- */

function main() {
  // Load all files for the main process
  loadMainProcessFiles();
  // Create the main window
  const page = devMode ? 'dev.html' : 'index.html';
  mainWindow = window.new(path.join(__dirname, 'view/template/', page));
  // In dev mode open the dev tools
  if (devMode) {
    mainWindow.webContents.openDevTools();
  }
}

function loadMainProcessFiles() {
  const mainProcessFiles = file.list(path.join(__dirname, 'main/'));
  mainProcessFiles.forEach(f => {
    const filepath = path.join(__dirname, 'main/', f)
    if (file.isFile(filepath)) {
      process[f.replaceAll('.js', '')] = require(filepath);
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
  // Alert
  wikipathEvent.emit('stop');
  // Remove BrowserView if is set
  const view = mainWindow.getBrowserView();
  if (view) {
    mainWindow.removeBrowserView(view);
  }
  console.log('Bye');
  // TODO
});

