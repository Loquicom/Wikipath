// Variables
let dialog;
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
        dialog.setContent(_('join.error.code.required'));
        dialog.open();
        return false;
    }
    // Send code to the main process to check if is valid an wait for the response
    ipcRenderer.send('connection-code', {code: code, pseudo: localStorage.getItem('pseudo')});
    // Show loading
    loader.open();
}

// Events
ipcRenderer.on('connected', (event, data) => {
    storage.set('players', data.players);
    storage.set('self', data.self);
    storage.set('server-name', data.name);
    loader.close();
    routerService.redirect('lobby');
});

ipcRenderer.on('invalid-code', (event, code) => {
    dialog.setContent(_('join.error.code.invalid', {code: code}));
    loader.close();
    dialog.open();
});

// When DOM is ready
$(() => {
    dialog = dialogService.createDialog('error', {type: 'primary', label: _('common.close')}, 'center');
    loader.setColor(loaderService.COLOR.BLUE);
    loader.setSpeed(loaderService.SPEED.FASTEST);
})