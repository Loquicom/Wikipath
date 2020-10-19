const path = require('path');

const prefix = '../page/';
const route = {
    menu: 'menu/index.html'
}

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
        if (route[dest]) {
            const filepath = path.join(__dirname, prefix, route[dest]);
            if (filepath[filepath.length - 1] === '/') {
                filepath = filepath.substring(0, filepath.length - 1);
            }
            return filepath + paramsQuery;
        }
        return false;
    }

    redirect(dest, params) {
        document.location = this.path(dest, params);
    }

    reload() {
        document.location.reload();
    }

}

module.exports = new RouterService();