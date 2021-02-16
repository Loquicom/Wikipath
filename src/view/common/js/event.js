console.log('Ici');
ipcRenderer.on('app-menu-rotate', (event, aze) => {
    console.log('la');
    if ($('body').hasClass('rotate')) {
        $('body').removeClass('rotate');
    } else {
        $('body').addClass('rotate');
    }
});