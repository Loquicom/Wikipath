// Variables
const playerHistory = storage.get('playerHistory');
const history = playerHistory.history;
let page = 0;
scope['player'] = {
    pseudo: playerHistory.pseudo
};
scope['webpage'] = {
    title: history[0].title
};

// Functions
function previous() {
    if (page <= 0) {
        return;
    }
    disabledBtn(--page, history.length -1);
    ipcRenderer.send('change-history', history[page].link);
    $('#page-title').html(entities.decode(history[page].title));
}

function next() {
    if (page >= history.length -1) {
        return;
    }
    disabledBtn(++page, history.length -1);
    ipcRenderer.send('change-history', history[page].link);
    $('#page-title').html(entities.decode(history[page].title));
}

function disabledBtn(numPage, maxPage) {
    if (maxPage == 0) {
        $('#prev-btn').addClass('is-disabled');
        $('#next-btn').addClass('is-disabled');
    } else if (numPage <= 0) {
        $('#prev-btn').addClass('is-disabled');
        $('#next-btn').removeClass('is-disabled');
    } else if (numPage >= maxPage) {
        $('#prev-btn').removeClass('is-disabled');
        $('#next-btn').addClass('is-disabled');
    } else {
        $('#prev-btn').removeClass('is-disabled');
        $('#next-btn').removeClass('is-disabled');
    }
}

$(() => {
    disabledBtn(page, history.length -1);
})