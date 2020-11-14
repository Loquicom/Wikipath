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
const SLOW = 200;

// Variable
let loader;

class Loader {

    #dialog
    #color
    #speed
    #progress = 0;
    #interval
    #open = false;

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
        if ([SLOW, NORMAL, FAST].indexOf(speed) === -1) {
            return false;
        }
        this.#speed = speed;
    }

    open() {
        //console.log(this.#color, this.#speed);
        this.#open = true;
        this.#dialog.open();
        this.#interval = setInterval(() => {
            this.#progress = ++this.#progress % 100;
            this.#dialog.setContent(`<progress class="nes-progress ${this.#color}" value="${this.#progress}" max="100" style="min-width: 400px"></progress>`)
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
        SLOW: SLOW,
        NORMAL: NORMAL,
        FAST: FAST
    }
};