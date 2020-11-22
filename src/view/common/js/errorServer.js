// Variables
const errorServerDialog = dialogService.createDialog('error-server', {type: 'primary', label: _('common.close')}, 'center');

// Functions
function goMenuScreen() {
    routerService.redirect('menu');
}

function errorDialog(msg) {
    loader.close();
    errorServerDialog.onClose(goMenuScreen);
    errorServerDialog.setContent(_(msg) + '<br>' + _('common.go.menu'));
    errorServerDialog.open();
}

// Events
ipcRenderer.on('server-stop', (event, message) => {
    errorDialog('error.stop');
});
ipcRenderer.on('error-notfound', (event, message) => {
    errorDialog('error.notfound');
});
ipcRenderer.on('error-connection', (event, message) => {
    errorDialog('error.connection');
});
ipcRenderer.on('error-disconnection', (event, message) => {
    errorDialog('error.disconnection');
});
ipcRenderer.on('error-broken-connection', (event, message) => {
    errorDialog('error.broken');
});
ipcRenderer.on('error-bad-protocol', (event, message) => {
    errorDialog('error.badprotocol');
});
ipcRenderer.on('error-in-game', (event, message) => {
    errorDialog('error.ingame');
});
ipcRenderer.on('error-server-full', (event, message) => {
    errorDialog('error.full');
});
ipcRenderer.on('error-unknown-command', (event, message) => {
    errorDialog('error.command');
});
ipcRenderer.on('error-unknown', (event, message) => {
    errorDialog('error.unknown');
});