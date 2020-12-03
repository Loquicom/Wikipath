// Imports
const dialogService = require('./dialog');

// Constant
const BLACK = '';
const BLUE = 'is-primary';
const GREEN = 'is-success';
const YELLOW = 'is-warning';
const RED = 'is-error';
const CHECKERBOARD = 'is-pattern';

const NORMAL = 100;
const FAST = 50;
const FASTEST = 25
const SLOW = 150;
const SLOWEST = 200;

// Variable
let loader;

class Loader {

    #dialog
    #color
    #speed
    #progress = 0;
    #modif = 1
    #interval
    #open = false;
    #content;

    constructor(color = BLACK, speed = NORMAL, name = 'loader') {
        this.#color = color;
        this.#speed = speed;
        this.#dialog = dialogService.createDialogWithContent(name, `<progress class="nes-progress ${this.#color}" value="${this.#progress}" max="100" style="min-width: 400px"></progress>`);
        this.#dialog.onClose(() => {
            if (this.#open) {
                this.#dialog.open();
            }
        });
    }

    setColor(color) {
        if ([BLACK, BLUE, GREEN, YELLOW, RED, CHECKERBOARD].indexOf(color) === -1) {
            return false;
        }
        this.#color = color;
    }

    setSpeed(speed) {
        if ([SLOWEST, SLOW, NORMAL, FAST, FASTEST].indexOf(speed) === -1) {
            return false;
        }
        this.#speed = speed;
    }

    setContent(content) {
        this.#content = content;
    }

    removeContent() {
        this.#content = null;
    }

    open() {
        this.#open = true;
        this.#dialog.open();
        this.#interval = setInterval(() => {
            // Change direction of progression 
            if (this.#progress > 99) {
                this.#modif = -1;
            } else if (this.#progress < 1) {
                this.#modif = 1;
            }
            // Generate dialog content
            let content = '';
            if (this.#content) {
                content += `<div class="center">${this.#content}</div><br/>`;
            }
            content += `<progress class="nes-progress ${this.#color}" value="${this.#progress}" max="100" style="min-width: 400px"></progress>`;
            // Update progression and loader bar
            this.#progress += this.#modif;
            this.#dialog.setContent(content);
        }, this.#speed);
    }

    close() {
        this.#open = false;
        this.#dialog.close();
        clearInterval(this.#interval);
    }

    isOpen() {
        return this.#open;
    }

}

module.exports = {
    getLoader() {
        if (!loader) {
            loader = new Loader();
        }
        return loader;
    },
    createLoader(name, color = BLACK, speed = NORMAL) {
        return new Loader(color, speed, name);
    },
    COLOR: {
        BLACK: BLACK,
        BLUE: BLUE,
        GREEN: GREEN,
        YELLOW: YELLOW,
        RED: RED,
        CHECKERBOARD: CHECKERBOARD
    },
    SPEED: {
        SLOWEST: SLOWEST,
        SLOW: SLOW,
        NORMAL: NORMAL,
        FAST: FAST,
        FASTEST: FASTEST
    }
};