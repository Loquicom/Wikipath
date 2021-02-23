class Pattern {

	#index = 0;
	#reset = false;

	constructor(pattern, resetAfterComplete = false) {
		this.pattern = pattern;
		this.#reset = resetAfterComplete;
	}

	nextElement(elt) {
		if (elt === this._expected) {
			console.log('a');
			this.#index++;
		} else {
			console.log('b');
			this.#index = 0;
		}
		// Return if pattern is complete
		if (this.isComplete) {
			if (this.#reset) {
				this.reset();
			}
			return true;
		} else {
			return false;
		}
	}

	reset() {
		this.#index = 0;
	}

	get isComplete() {
		return this.#index >= this.pattern.length;
	}

	get _expected() {
		return this.pattern[this.#index];
	}
}

module.exports = Pattern;