// Imports
const $ = require('jquery');
const { ipcRenderer } = require('electron');
const path = require('path');
const Handlebars = require('handlebars');
const Entities = require('html-entities').Html5Entities;
const i18n = require('../../../helper/i18n');
const storage = require('../../service/storage');
const routerService = require('../../service/router');
const dialogService = require('../../service/dialog');
const loaderService = require('../../service/loader');
const entities = new Entities();
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

function parseURLParameter() {
    const data = {};
    const get = location.search.substr(1).split("&");
    for (elt of get) {
        const split = elt.split("=");
        data[split[0]] = decodeURIComponent(split[1]);
    }
    return data;
}

function getURLParameter(key) {
    const get = parseURLParameter();
    return get[key];
}

// Override
Array.prototype.removeItem = function(item) {
    const index = this.indexOf(item);
    if (index !== -1) {
        this.splice(index, 1);
    }
    return this;
}

$.fn.enterKey = function(fn) {
    this.each(function() {
        $(this).on('keypress', function(event) {
            if (event.key === 'Enter') {
                fn.call(this);
            }
        });
    });
}

// Codes
i18n.config(path.join(__dirname, '../../../../locales'));
const _ = i18n._;