const { read } = require("fs");

// Variables
const players = storage.get('players');
scope.lobby = {name: storage.get('server-name')};

// Functions
function quit() {
    ipcRenderer.send('quit-game');
    routerService.redirect('menu');
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

// When DOM is ready
$(() => {
    $('#lobby-content').html(generateTableContent(players));
});