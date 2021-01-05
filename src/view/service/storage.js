class Storage {

    set(key, value) {
        let datatype;
        switch (typeof value) {
            case 'object':
                value = JSON.stringify(value);
                datatype = 'object';
                break;
            case 'boolean':
                datatype = 'boolean';
                break;
            default:
                datatype = 'string';
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
        switch (datatype) {
            case 'object':
                value = JSON.parse(value);
                break;
            case 'boolean':
                value = (value === 'true') ? true : false;
                break;
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