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

// DOM Ready
$(() => {
    $('#destination-info').on('click', () => {
        ipcRenderer.send('information', end);
    });
});