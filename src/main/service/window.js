const { BrowserWindow } = require('electron');

const defaultValues = {
    width: 1200,
    height: 800
};
const window = {};

window.hidden = function (file) {
    const win = new BrowserWindow({
        width: 0,
        height: 0,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    if (file) {
        win.loadFile(file);
    }
    return win;
}

window.new = function (file, width, height, parent) {
    // Default values
    width = width ? width : defaultValues.width;
    height = height ? height : defaultValues.height;
    // Options
    const opts = {
        width: width,
        height: height,
        //icon: ,
        worldSafeExecuteJavaScript: true, 
        contextIsolation: true,
        webPreferences: {
            nodeIntegration: true
        }
    }
    // Add parent if have one
    if (parent) {
        opts.parent = parent;
    }
    // New window
    const win = new BrowserWindow (opts);
    if (file) {
        win.loadFile(file);
    }
    return win;
}

window.frameless = function (file, width, height, parent) {
    // Default values
    width = width ? width : defaultValues.width;
    height = height ? height : defaultValues.height;
    // Options
    const opts = {
        width: width,
        height: height,
        frame: false,
        //icon: ,
        worldSafeExecuteJavaScript: true, 
        contextIsolation: true,
        webPreferences: {
            nodeIntegration: true
        }
    }
    // Add parent if have one
    if (parent) {
        opts.parent = parent;
    }
    // New window
    const win = new BrowserWindow (opts);
    if (file) {
        win.loadFile(file);
    }
    return win;
}

module.exports = window;
module.exports.defaultValues = defaultValues;