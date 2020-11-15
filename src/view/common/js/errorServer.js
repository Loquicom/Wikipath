// Variables
const errorServerDialog = dialogService.createDialog('error-server', {type: 'primary', label: 'Fermer'}, 'center');

// Functions
function goMenuScreen() {
    routerService.redirect('menu');
}

// Events
ipcRenderer.on('error-in-game', (event, message) => {
    loader.close();
    errorServerDialog.onClose(goMenuScreen);
    errorServerDialog.setContent('Le serveur est en jeu<br>Retour au menu');
    errorServerDialog.open();
});
ipcRenderer.on('error-server-full', (event, message) => {
    loader.close();
    errorServerDialog.onClose(goMenuScreen);
    errorServerDialog.setContent('Le serveur est complet<br>Retour au menu');
    errorServerDialog.open();
});
ipcRenderer.on('error-unknown-command', (event, message) => {
    loader.close();
    errorServerDialog.onClose(goMenuScreen);
    errorServerDialog.setContent('Erreur de communication<br>Retour au menu');
    errorServerDialog.open();
});
ipcRenderer.on('error-unknown-command', (event, message) => {
    loader.close();
    errorServerDialog.onClose(goMenuScreen);
    errorServerDialog.setContent('Erreur de inconnue<br>Retour au menu');
    errorServerDialog.open();
});