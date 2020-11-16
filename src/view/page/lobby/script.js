// Functions
function quit() {
    ipcRenderer.send('quit-game');
    routerService.redirect('menu');
}