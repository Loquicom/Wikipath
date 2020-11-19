// Imports
const $ = require('jquery');
const { ipcRenderer } = require('electron');
const path = require('path');
const Handlebars = require('handlebars');
const i18n = require('../../../helper/i18n');
const storage = require('../../service/storage');
const routerService = require('../../service/router');
const dialogService = require('../../service/dialog');
const loaderService = require('../../service/loader');
const loader = loaderService.getLoader();

// Variables
const scope = {};

// Functions
function convertToArray(obj) {
    if (Array.isArray(obj)) {
        return obj;
    }
    const array = [];
    for(let key in obj) {
        array.push(obj[key]);
    }
    return array;
}

// Codes
i18n.config(path.join(__dirname, '../../../../locales'));