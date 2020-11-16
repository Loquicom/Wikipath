// Variables
const errorServerDialog = dialogService.createDialog('error-server', {type: 'primary', label: 'Fermer'}, 'center');

// Functions
function goMenuScreen() {
    routerService.redirect('menu');
}

function errorDialog(msg) {
    loader.close();
    errorServerDialog.onClose(goMenuScreen);
    errorServerDialog.setContent(msg + '<br>Retour au menu');
    errorServerDialog.open();
}

// Events
ipcRenderer.on('error-connection', (event, message) => {
    errorDialog('Erreur de connexion avec le serveur');
});
ipcRenderer.on('error-broken-connection', (event, message) => {
    errorDialog('Connexion perdue avec le serveur');
});
ipcRenderer.on('error-in-game', (event, message) => {
    errorDialog('Le serveur est en jeu');
});
ipcRenderer.on('error-server-full', (event, message) => {
    errorDialog('Le serveur est complet');
});
ipcRenderer.on('error-unknown-command', (event, message) => {
    errorDialog('Erreur de communication');
});
ipcRenderer.on('error-unknown-command', (event, message) => {
    errorDialog('Erreur inconnue');
});