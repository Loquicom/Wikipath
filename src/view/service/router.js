// Imports
const $ = require('jquery');
const path = require('path');
const { ipcRenderer } = require('electron');
const file = require('../../helper/file');
const template = require('./template');
const storage = require('./storage');
const loaderService = require('./loader');

// Parameters
const prefix = '../template/';
const route = {};

class RouterService {

    #lastPage = null;
    #lastScope = null;
    #backPage = null;
    #backScope = null;

    path(dest) {
        // Get path to the file
        let filepath;
        if (route[dest]) {
            // Check if a rule exist for the destination
            filepath = path.join(__dirname, prefix, route[dest]);
        } else {
            // Otherwise check if a folder exist for the destination
            filepath = path.join(__dirname, prefix, dest);
            if (!file.exist(filepath)) {
                return false;
            }
        }
        // Add GET parameter
        if (filepath[filepath.length - 1] === '/') {
            filepath = filepath.substring(0, filepath.length - 1);
        }
        return filepath;
    }

    redirect(dest, scope = {}) {
        // Get all paths
        const filepath = this.path(dest + '/index.html');
        const scriptpath = this.path(dest + '/script.js');
        const stylepath = this.path(dest + '/style.css');
        if (!filepath) {
            return false;
        }
        // Set the new page name
        storage.set('page', dest);
        // Read files
        const filedata = file.read(filepath);
        let script;
        if (scriptpath) {
            script = file.read(scriptpath);
        }
        let style;
        if (stylepath) {
            style = file.read(stylepath);
        }
        // Generate HTML
        let html = '';
        if (style) {
            html += '<style>\n' + style + '\n</style>';
        }
        html += filedata;
        if (script) {
            html += '<script>\n' + script + '\n</script>';
        }
        html = template.generate(html, scope);
        // Copy the scope and the page name
        this.#backPage = this.#lastPage;
        this.#backScope = this.#lastScope;
        this.#lastPage = dest;
        this.#lastScope = JSON.parse(JSON.stringify(scope));
        // Clear the scope and ipcRenderer events
        for (const key in scope) {
            delete scope[key];
        }
        ipcRenderer.removeAllListeners();
        // Show html
        loaderService.getLoader().close();
        $('#router').html(html);
    }

    back() {
        if (!this.#backPage) {
            return false;
        }
        return this.redirect(this.#backPage, this.#backScope);
    }

}

module.exports = new RouterService();