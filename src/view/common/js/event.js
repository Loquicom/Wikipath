// Add event listener after all process
setTimeout(() => {
    ipcRenderer.on('app-menu-rotate', (event, aze) => {
        if ($('body').hasClass('rotate')) {
            $('body').removeClass('rotate');
        } else {
            $('body').addClass('rotate');
        }
    });
}, 0);