const { Menu, MenuItem, app } = require('electron');

function buildMenu() {
    const menu = new Menu();
    menu.append(new MenuItem({
        label: _('app.menu.context.copy'),
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
    }));
    menu.append(new MenuItem({
        label: _('app.menu.context.cut'),
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
    }));
    menu.append(new MenuItem({
        label: _('app.menu.context.paste'),
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
    }));
    return menu;
}
    
app.on('browser-window-created', (event, win) => {
    win.webContents.on('context-menu', (evt, params) => {
        const menu = buildMenu();
        menu.popup(win, params.x, params.y);
    });
});
