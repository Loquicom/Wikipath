// Variables
scope.start = storage.get('start');
scope.end = storage.get('end');

// Functions
function reset() {
    ipcRenderer.send('reset', scope.start);
}

// Event
ipcRenderer.on('waiting-players', () => {
    loader.open();
});
ipcRenderer.on('result', (event, result) => {
    storage.set('result', result);
    scope.server = {name: storage.get('server-name')};
    routerService.redirect('result', scope);
});

// DOM Ready
$(() => {
    $('#destination-info').on('click', () => {
        ipcRenderer.send('information', scope.end);
    });
    loader.setContent(_('game.wait'));
    loader.setColor(loaderService.COLOR.CHECKERBOARD);
    loader.setSpeed(loaderService.SPEED.FAST);
});