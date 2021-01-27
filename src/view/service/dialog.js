// Imports
const $ = require('jquery');

class Dialog {

    id = 'dialog';

    constructor(name, buttons = [], position = 'right') {
        this.id += `-${name}`;
        if ($(`#${this.id}`).length) {
            $(`#${this.id}`).remove();
        }
        $('body').append(this.dialogHTML(this.id, buttons, position));
    }

    onClose(callback) {
        if (typeof callback !== 'function') {
            return false;
        }
        this.getDialog().addEventListener('close', callback);
    }

    open(content) {
        if (content) {
            this.setContent(content);
        }
        this.getDialog().showModal();
    }

    close() {
        this.getDialog().close();
    }

    setContent(content) {
        $(`#${this.id}-content`).html(content);
    }

    setButton(index, label, type = '') {
        const elt = $(`#${id}-btn-${index}`);
        if (elt.length === 0) {
            return;
        }
        elt.html(label);
        if (type.trim()) {
            elt.removeClass().addClass(`nes-btn is-${type}`);
        }
    }

    setButtonsPosition(position) {
        if (!position.trim()) {
            return;
        }
        $(`#${this.id}-menu`).removeClass().addClass(`dialog-menu ${position}`);
    }

    isOpen() {
        return this.getDialog().open;
    }

    getDialog() {
        return $(`#${this.id}`).get()[0];
    }

    dialogHTML(id, buttons = [], position = 'right') {
        let html = `\n<!-- Dialog: ${id} -->\n`;
        html += `<dialog class="nes-dialog is-rounded" id="${id}">\n`;
        html += '   <form method="dialog">\n';
        html += `       <p id="${id}-content"></p>\n`;
        if (buttons.length > 0) {
            html += `       <menu id="${id}-menu" class="dialog-menu ${position}">\n`;
            let i = 1;
            for (let btn of buttons) {
                const type = (btn.type) ? `is-${btn.type}` : '';
                const label = (btn.label) ? btn.label : 'Button';
                html += `           <button id="${id}-btn-${i}" class="nes-btn ${type}">${label}</button>\n`;
                i++;
            }
            html += '       </menu>\n';
        }
        html += '   </form>\n';
        html += '</dialog>\n';
        return html;
    }
    
}

class DialogService {

    dialogs = {};

    newDialog(name, buttons = [], position = '') {
        if (!Array.isArray(buttons)) {
            buttons = [buttons];
        }
        this.dialogs[name] = new Dialog(name, buttons, position);
        return this.dialogs[name];
    }

    createDialog(name, buttons = [], position = '') {
        if (!this.dialogs[name]) {
            if (!Array.isArray(buttons)) {
                buttons = [buttons];
            }
            this.dialogs[name] = new Dialog(name, buttons, position);
        }
        return this.dialogs[name];
    }

    createDialogWithContent(name, content = '', buttons = [], position = '') {
        const dialog = this.createDialog(name, buttons, position);
        dialog.setContent(content);
        return dialog;
    }

    getDialog(name) {
        if (!this.dialogs[name]) {
            return false;
        }
        return this.dialogs[name];
    }

    removeDialog(name) {
        if (!this.dialogs[name]) {
            return false;
        }
        delete this.dialogs[name];
        return true;
    }

}

module.exports = new DialogService();