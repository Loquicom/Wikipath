scope.webpage = storage.get('end');

$(() => {
    $('#close-btn').on('click', () => {
        ipcRenderer.send('close-information');
    });
});