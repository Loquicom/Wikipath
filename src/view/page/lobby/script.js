// Variables
const players = storage.get('players');
const self = storage.get('self');
scope.lobby = {name: storage.get('server-name')};

// Functions
function quit() {
    ipcRenderer.send('quit-game');
    routerService.redirect('menu');
}

function ready() {
    $($(`#player-${self.id}-ready`).children()[0]).removeClass('is-empty');
    $('.ready-btn').each((index, elt) => {
        $(elt).addClass('is-primary');
    });
    ipcRenderer.send('ready');
}

function unready() {
    $($(`#player-${self.id}-ready`).children()[0]).addClass('is-empty');
    $('.ready-btn').each((index, elt) => {
        $(elt).removeClass('is-primary');
    });
    ipcRenderer.send('unready');
}

function generateRow(player) {
    const ready = (player.ready) ? '' : 'is-empty';
    let result = `<tr id="player-${player.id}">`;
    result += `<td id="player-${player.id}-pseudo">${player.pseudo}</td>`;
    result += `<td id="player-${player.id}-ready"><i class="nes-icon star ${ready}"></i></td>`;
    result += `</tr>`;
    return result;
}

function generateTableContent(players) {
    players = convertToArray(players);
    let result = '';
    for (let player of players) {
        result += generateRow(player);
    }
    return result;
}

// Events
ipcRenderer.on('new-player', (event, data) => {
    players[data.id] = data;
    storage.set('players', players);
    $('#lobby-content').append(generateRow(data));
});
ipcRenderer.on('player-quit', (event, data) => {
    delete players[data.id];
    storage.set('players', players);
    $(`#player-${data.id}`).remove();
});
ipcRenderer.on('player-ready', (event, data) => {
    $($(`#player-${data.id}-ready`).children()[0]).removeClass('is-empty');
});
ipcRenderer.on('player-unready', (event, data) => {
    $($(`#player-${data.id}-ready`).children()[0]).addClass('is-empty');
});
ipcRenderer.on('play', (event, data) => {
    storage.set('start', data.start);
    storage.set('end', data.end);
    routerService.redirect('game');
});
ipcRenderer.on('server-config', (event, data) => {
    storage.set('config', data);
});
ipcRenderer.on('loading-game', (event, data) => {
    loader.open();
});

// When DOM is ready
$(() => {
    // Generate table with all players connected
    $('#lobby-content').html(generateTableContent(players));
    // Toogle ready
    $('.ready-btn').on('click', function () {
        if ($(this).hasClass('is-primary')) {
            unready();
        } else {
            ready();
        }
    });
    // Get the server config
    ipcRenderer.send('server-config');
    // Set the loader parameters
    loader.setColor(loaderService.COLOR.BLUE);
    loader.setSpeed(loaderService.SPEED.FASTEST);
    // Enter key press
    $(document).enterKey(() => {
        $('.ready-btn')[0].click();
    });
});