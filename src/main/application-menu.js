const { Menu } = require('electron');

function template() {
    return [
        {
            label: _('app.menu.application.application'),
            submenu: [
                {
                    label: _('app.menu.application.close'),
                    accelerator: 'CmdOrCtrl+W',
                    role: 'close'
                },
                {
                    label: _('app.menu.application.reset'),
                    accelerator: 'CmdOrCtrl+R',
                    click: () => {
                        console.log('TODO reset');
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: _('app.menu.application.rotate'),
                    click: () => {
                        console.log('TODO rotate');
                    }
                }
            ]
        },
        {
            label: _('app.menu.application.window'),
            submenu: [
                {
                    label: _('app.menu.application.minimize'),
                    accelerator: 'CmdOrCtrl+M',
                    role: 'minimize'
                },
                {
                    label: _('app.menu.application.size'),
                    click: () => {
                        console.log('TODO reset size')
                    }
                }
            ]
        },
        {
            label: _('app.menu.application.about'),
            submenu: [
                {
                    label: _('app.menu.application.about'),
                    click: () => {
                        console.log('TODO about');
                    }
                },
                {
                    label: _('app.menu.application.version'),
                    click: () => {
                        console.log('TODO version');
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: _('app.menu.application.donation'),
                    click: () => {
                        console.log('TODO donation');
                    }
                }
            ]
        }
    ];
}

function buildApplicationMenu() {
    const appMenu = Menu.buildFromTemplate(template());
    Menu.setApplicationMenu(appMenu);
}

buildApplicationMenu();

module.exports = buildApplicationMenu;