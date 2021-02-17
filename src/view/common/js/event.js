
function setRendererEvents() {
    ipcRenderer.on('app-menu-reset', (event) => {
        routerService.redirect('menu', scope);
    });

    ipcRenderer.on('app-menu-rotate', (event) => {
        if ($('body').hasClass('rotate')) {
            $('body').removeClass('rotate');
        } else {
            $('body').addClass('rotate');
        }
    });

    ipcRenderer.on('context-menu-back', (event) => {
        routerService.back();
    });
}