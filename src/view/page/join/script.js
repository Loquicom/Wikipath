// Imports
const $ = require('jquery');
const { ipcRenderer } = require('electron');
const routerService = require('../../service/router');
const dialogService = require('../../service/dialog');

// Varibles
let dialog;

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
}

// Events
ipcRenderer.on('connect', () => {
    routerService.redirect('lobby');
});

ipcRenderer.on('invalid-code', (event, code) => {
    dialog.setContent(`Le code : ${code} est invalide`);
    dialog.open();
});

// When DOM is ready
$(() => {
    dialog = dialogService.createDialog('error', {type: 'primary', label: 'Fermer'}, 'center');
})