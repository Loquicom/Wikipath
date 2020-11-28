const {dialog, ipcMain} = require('electron');
const window = require('../../helper/window');
const dlg = {};

dlg.messagePromise = function(title, content, type = '', buttons = ['Ok'], defaultButton = 0, attach = true) {
    const opts = {
        type: type,
        title: title,
        message: content,
        buttons: buttons,
        defaultId: defaultButton
    };
    if (attach) {
        return dialog.showMessageBox(mainWindow, opts);
    } else {
        return dialog.showMessageBox(opts);
    }
}

dlg.message = function(title, content, type = 'info', buttons = ['Ok'], defaultButton = 0, attach = true, callback = null) {
    const promise = dlg.messagePromise(title, content, type, buttons, defaultButton, attach);
    if (callback !== null) {
        promise.then(data => {
            callback(data.response, buttons[data.response]);
        });
    }
}

dlg.fileSelectorPromise = function(openFile = true, openDir = false, filters = [{name: 'Tous les fichiers', extensions: ['*']}]) {
    const opts = {
        properties: [],
        filters: filters
    }
    if (openFile) {
        opts.properties.push('openFile');
    }
    if (openDir) {
        opts.properties.push('openDirectory');
    }
    return dialog.showOpenDialog(opts)
}

dlg.fileSelector = function(openFile = true, openDir = false, filters = [{name: 'Tous les fichiers', extensions: ['*']}], callback = null) {
    const promise = dlg.fileSelectorPromise(openFile, openDir, filters);
    if (callback !== null) {
        promise.then(data => {
            callback(data.canceled, data.filePaths[0]);
        });
    }
}

dlg.error = function (title, content) {
    dialog.showErrorBox(title, content);
}

dlg.customPromise = function (file) {
    let win = null;
    return new Promise(resolve => {
        // Genererate key for answer
        const key = '-' + Math.random().toString(36).substr(2, 9);
        // Wait win answser
        ipcMain.once('dialog-answer' + key, (arg, answer) => {
            win.close();
            resolve(answer);
        });
        // Create win
        win = window.frameless(file, mainWindow);
        // When win is ready send the key
        win.on('focus', () => {
            setTimeout(() => {
                win.webContents.send('dialog-key', key);
            }, 500);
        })
    });
}

dlg.custom = function (file, callback) {
    const promise = dlg.customPromise(file);
    if (callback) {
        promise.then(data => {
            callback(data);
        });
    }
}

module.exports = dlg;