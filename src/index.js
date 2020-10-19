const { app } = require('electron');
const path = require('path');
const window = require('./helper/window');

/* --- Squirrel --- */

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

/* --- Initialisation --- */

app.allowRendererProcessReuse = true;

/* --- Functions --- */

function main() {
  const mainWindow = window.new(path.join(__dirname, 'view/page/menu/index.html'));

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
 // TODO
});

