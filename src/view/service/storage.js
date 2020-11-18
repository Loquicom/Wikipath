class Storage {

    set(key, value) {
        let datatype = 'string';
        if (typeof value === 'object') {
            value = JSON.stringify(value);
            datatype = 'object';
        }
        localStorage.setItem(key, value);
        localStorage.setItem('#' + key + '-datatype', datatype);
    }

    exist(key) {
        return localStorage.getItem(key) ? true : false;
    }

    get(key) {
        let value = localStorage.getItem(key);
        if (!value) {
            return false;
        }
        const datatype = localStorage.getItem('#' + key + '-datatype');
        if (datatype === 'object') {
            value = JSON.parse(value);
        }
        return value;
    }

    remove(key) {
        localStorage.removeItem(key);
        localStorage.removeItem('#' + key + "-datatype");
    }

    clear() {
        localStorage.clear();
    }

}

module.exports = new Storage();