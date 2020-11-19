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
}

function unready() {
    $($(`#player-${self.id}-ready`).children()[0]).addClass('is-empty');
    $('.ready-btn').each((index, elt) => {
        $(elt).removeClass('is-primary');
    });
}

function generateTableContent(players) {
    players = convertToArray(players);
    let result = '';
    for (let player of players) {
        const ready = (player.ready) ? '' : 'is-empty';
        result += `<tr id="player-${player.id}">`;
        result += `<td id="player-${player.id}-pseudo">${player.pseudo}</td>`;
        result += `<td id="player-${player.id}-ready"><i class="nes-icon star ${ready}"></i></td>`;
        result += `</tr>`;
    }
    return result;
}

// Events

// When DOM is ready
$(() => {
    $('#lobby-content').html(generateTableContent(players));
    $('.ready-btn').on('click', function () {
        if ($(this).hasClass('is-primary')) {
            unready();
        } else {
            ready();
        }
    });
});