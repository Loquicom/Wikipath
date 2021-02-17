
function setRendererEvents() {
    ipcRenderer.on('app-menu-rotate', (event) => {
        if ($('body').hasClass('rotate')) {
            $('body').removeClass('rotate');
        } else {
            $('body').addClass('rotate');
        }
    });
}
