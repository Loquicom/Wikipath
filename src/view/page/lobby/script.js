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
    console.log(self);
}

function generateTableContent(players) {
    players = convertToArray(players);
    let result = '';
    for (let player of players) {
        const ready = (player.ready) ? '' : 'is-empty';
        result += `<tr id="player-${player.id}">`;
        result += `<td>${player.pseudo}</td>`;
        result += `<td><i class="nes-icon star ${ready}"></i></td>`;
        result += `</tr>`;
    }
    return result;
}

// Events

// When DOM is ready
$(() => {
    $('#lobby-content').html(generateTableContent(players));
});