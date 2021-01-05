// Variables
scope.result = storage.get('result');
scope.playersHistory = {};

// Functions
function generateResult(result, history = null) {
    let html = '';
    for(let res of result) {
        html += '<tr>';
        html += `<td>${res.pos}</td>`;
        html += `<td>${res.pseudo}</td>`;
        html += `<td><button class="nes-btn is-success" data-pos="${res.pos}" onclick="viewHistory(this)">${_('result.view')}</button></td>`;
        html += '</tr>';
        if (history) {
            history[res.pos] = {
                pseudo: res.pseudo,
                history: res.history
            }
        }
    }
    return html;
}

function viewHistory(btn) {
    const playerHistory = scope.playersHistory[$(btn).attr('data-pos')];
    storage.set('playerHistory', playerHistory);
    ipcRenderer.send('view-history', playerHistory.history[0].link);
}

function backToLobby() {
    ipcRenderer.send('get-players-info');
}

// Event
ipcRenderer.on('players-info', (event, players) => {
    storage.set('players', players);
    storage.remove('result');
    scope.server = {name: storage.get('server-name')};
    routerService.redirect('lobby', scope);
});

// DOM Ready
$(() => {
    $('#result-content').html(generateResult(scope.result, scope.playersHistory));
});