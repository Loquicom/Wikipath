// Variables
const errorServerDialog = dialogService.createDialog('error-server', {type: 'primary', label: _('common.close')}, 'center');

// Functions
function goMenuScreen() {
    routerService.redirect('menu');
}

function errorDialog(msg, redirect = true) {
    if (!errorServerDialog.isOpen()) {
        loader.close();
        let content = _(msg)
        if (redirect) {
            errorServerDialog.onClose(goMenuScreen);
            content += `<br><p class="center">${_('common.go.menu')}</p>`;
        }
        errorServerDialog.setContent(content);
        errorServerDialog.open();
    }
}

// Events
ipcRenderer.on('server-stop', (event, message) => {
    errorDialog('error.stop');
});
ipcRenderer.on('error-notfound', (event, message) => {
    errorDialog('error.notfound', false);
});
ipcRenderer.on('error-connection', (event, message) => {
    errorDialog('error.connection');
});
ipcRenderer.on('error-disconnection', (event, message) => {
    // Trigger disconnection if no other error is trigger
    setTimeout(() => {
        errorDialog('error.disconnection');
    }, 500);
});
ipcRenderer.on('error-broken-connection', (event, message) => {
    errorDialog('error.broken');
});
ipcRenderer.on('error-bad-protocol', (event, message) => {
    errorDialog('error.badprotocol', false);
});
ipcRenderer.on('error-in-game', (event, message) => {
    errorDialog('error.ingame', false);
});
ipcRenderer.on('error-server-full', (event, message) => {
    errorDialog('error.full', false);
});
ipcRenderer.on('error-unknown-command', (event, message) => {
    errorDialog('error.command');
});
ipcRenderer.on('error-unknown', (event, message) => {
    errorDialog('error.unknown');
});