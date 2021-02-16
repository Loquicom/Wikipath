// Imports
const $ = require('jquery');
const { ipcRenderer, shell } = require('electron');
const path = require('path');
const Entities = require('html-entities').Html5Entities;
const fs = require('fs');

// Imports services
let prefix = '../';
let servicePath = path.join(__dirname, prefix, 'service');
while(!fs.existsSync(servicePath)) {
    prefix += '../'
    servicePath = path.join(__dirname, prefix, 'service');
}
const storage = require(path.join(servicePath, 'storage'));
const template = require(path.join(servicePath, 'template'));
const routerService = require(path.join(servicePath, 'router'));
const dialogService = require(path.join(servicePath, 'dialog'));
const loaderService = require(path.join(servicePath, 'loader'));

// Instanciate
const entities = new Entities();
const loader = loaderService.getLoader();
let dialog;

// Variables
const scope = {};
const _ = template.translate.bind(template);

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

// Override & Functions
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

// Listeners
$('body').on('click', 'a', function(evt) {
    // Get the target
    const target = $(this).attr('target');
    // If target is browser open link in the default browser
    if (target !== '_browser') {
        return;
    }
    evt.preventDefault();
    const link = $(this).attr('href');
    shell.openExternal(link);
});