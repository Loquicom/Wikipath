const Pattern = require('../../helper/pattern');

class KeyPattern {

	#keys = null;
	#pattern = null
	#handler = null;
	#event = null;
	#callback = null;

	/**
	 * 
	 * @param string[] keys Suite de touches pour déclancher le pattern
	 * @param {*} opt Peut avoir deux parametres : callback qui est une fonction et emit le nom de l'event. Ils sont déclenchés lorsque que le pattern est valide
	 */
	constructor(keys, opt = {}) {
		this.#keys = keys;
		if (opt.emit) {
			this.emit(opt.emit);
		}
		if (opt.callback) {
			this.callback(opt.callback);
		}
	}

	emit(eventName) {
		if (typeof eventName === 'string' && eventName.trim() !== '') {
			this.#event = new CustomEvent(eventName, { bubbles: true });
		}
	}

	removeEvent() {
		this.#event = null;
	}

	callback(fn) {
		if (typeof fn === 'function') {
			this.#callback = fn;
		}
	}

	removeCallback() {
		this.#callback = null;
	}

	start() {
		if (!this.#keys || this.#pattern) {
			return;
		}
		this.#pattern = new Pattern(this.#keys);
		this.#handler = (event) => {
			console.log(event.key);
			this.#pattern.nextElement(event.key);
			if (this.#pattern.isComplete) {
				if (this.#event) {
					document.dispatchEvent(this.#event);
				}
				if (this.#callback) {
					this.#callback();
				}
			}
		}
		document.addEventListener('keydown', this.#handler);
	}

	stop() {
		if (this.#pattern) {
			document.removeEventListener('keydown', this.#handler);
			this.#pattern = null;
		}
	}
}

module.exports = KeyPattern;