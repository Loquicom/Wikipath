// Imports
const $ = require('jquery');
const { ipcRenderer } = require('electron');
const routerService = require('../../service/router');
const dialogService = require('../../service/dialog');
const loaderService = require('../../service/loader');

// Varibles
let dialog;
let loader;
let progress = 0;
let interval;

// Functions
function back() {
    routerService.redirect('menu');
}

function join() {
    // Check if code is not empty
    const code = $('#code').val();
    if (!code.trim()) {
        dialog.setContent('Le code est requis');
        dialog.open();
        return false;
    }
    // Send code to the main process to check if is valid an wait for the response
    ipcRenderer.send('connection-code', code);
    // Show loading
    loader.open();
}

// Events
ipcRenderer.on('connect', () => {
    routerService.redirect('lobby');
});

ipcRenderer.on('invalid-code', (event, code) => {
    dialog.setContent(`Le code : ${code} est invalide`);
    loader.close();
    dialog.open();
});

// When DOM is ready
$(() => {
    dialog = dialogService.createDialog('error', {type: 'primary', label: 'Fermer'}, 'center');
    loader = loaderService.getLoader();
    loader.setColor(loaderService.COLOR.BLUE);
    loader.setSpeed(loaderService.SPEED.FAST);
})