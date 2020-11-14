// Imports
const path = require('path');
const file = require('../../helper/file');

// Parameters
const prefix = '../page/';
const route = {};

class RouterService {

    path(dest, params) {
        // Add GET params
        let paramsQuery = '';
        if (params) {
            let first = true;
            for (const key in params) {
                paramsQuery += first ? '?' : '&';
                paramsQuery += `${key}=${params[key]}`;
                first = false; 
            }
        }
        // Get path to the file
        let filepath;
        if (route[dest]) {
            // Check if a rule exist for the destination
            filepath = path.join(__dirname, prefix, route[dest]);
        } else {
            // Otherwise check if a folder exist for the destination
            filepath = path.join(__dirname, prefix, dest, 'index.html');
            if (!file.exist(filepath)) {
                return false;
            }
        }
        // Add GET parameter
        if (filepath[filepath.length - 1] === '/') {
            filepath = filepath.substring(0, filepath.length - 1);
        }
        return filepath + paramsQuery;
    }

    redirect(dest, params) {
        const filepath = this.path(dest, params);;
        if (!filepath) {
            return false;
        }
        document.location = filepath;
    }

    reload() {
        document.location.reload();
    }

}

module.exports = new RouterService();