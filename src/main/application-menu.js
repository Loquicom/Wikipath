const { Menu, shell } = require('electron');
const process = require('process');
const constant = require('../constant');
const window = require('./service/window');
const dialog = require('./service/dialog');

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
                    accelerator: devMode ? 'CmdOrCtrl+Shift+R' : 'CmdOrCtrl+R',
                    click: () => {
                        wikipathEvent.emit('stop');
                        wikipathEvent.emit('stop-browser');
                        mainWindow.webContents.send('app-menu-reset');
                    },
                },
                {
                    type: 'separator'
                },
                {
                    label: _('app.menu.application.rotate'),
                    type: 'checkbox',
                    click: () => {
                        mainWindow.webContents.send('app-menu-rotate');
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
                        mainWindow.setSize(window.defaultValues.width, window.defaultValues.height, true);
                    }
                },
                {
                    label: _('app.menu.application.reload'),
                    accelerator: devMode ? 'CmdOrCtrl+R' : null,
                    role: 'reload',
                    visible: devMode
                },
                {
                    label: _('app.menu.application.devtool'),
                    accelerator: devMode ? 'CmdOrCtrl+Shift+I' : null,
                    role: 'toggleDevTools',
                    visible: devMode
                }
            ]
        },
        {
            label: _('app.menu.application.about'),
            submenu: [
                {
                    label: _('app.menu.application.about'),
                    click: () => {
                        dialog.message(
                            _('app.menu.application.about'), 
                            _('app.dialog.about', {licence: constant.LICENCE}),
                            'info',
                            [_('common.close')]
                        );
                    }
                },
                {
                    label: _('app.menu.application.version'),
                    click: () => {
                        const params = {
                            version: constant.VERSION,
                            protocol: constant.PROTOCOL_VERSION,
                            electron: process.versions.electron,
                            node: process.versions.node,
                            chrome: process.versions.chrome
                        }
                        dialog.message(
                            _('app.menu.application.version'), 
                            _('app.dialog.version', params),
                            'info',
                            [_('common.close')]
                        );
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: _('app.menu.application.donation'),
                    click: () => {
                        const rand = Math.floor(Math.random() * constant.DONATION_LINK.length);
                        shell.openExternal(constant.DONATION_LINK[rand]);
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