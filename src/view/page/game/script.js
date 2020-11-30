// Variables
const start = storage.get('start');
const end = storage.get('end');
const config = storage.get('config');
scope.config = config;
scope.url = {
    start: start.title,
    end: end.title.replaceAll('<i>', '').replaceAll('</i>', '')
};

// Functions
function reset() {
    ipcRenderer.send('reset', start);
}

// Event
ipcRenderer.on('waiting-players', () => {
    loader.open();
});
ipcRenderer.on('finish', () => {
    // TODO redirect
});

// DOM Ready
$(() => {
    $('#destination-info').on('click', () => {
        ipcRenderer.send('information', end);
    });
    loader.setContent(_('game.wait'));
    loader.setColor(loaderService.COLOR.CHECKERBOARD);
    loader.setSpeed(loaderService.SPEED.FAST);
});