// Imports
const { app } = require('electron');
const path = require('path');
const Entities = require('html-entities').AllHtmlEntities;
const file = require('./file');

// Variables
const entities = new Entities();
let options = {
    add: true,
    defaultLocale: 'en'
}
let directory;
let filepath;
let currentLocale;
let translations;

// Functions
function option(opts) {
    options = opts;
}

function config(dir, locale = null) {
    // Get the file name with the local
    const systemLocal = app ? app.getLocale() : (navigator.userLanguage || navigator.language || navigator.browserLanguage)
    let filename = locale ? locale : systemLocal;
    // Check if the file exist
    if (!file.exist(path.join(dir, filename + '.json'))) {
        // If it's a specific version for a country check the base version
        if (filename.length > 2 && filename[2] === '-') {
            filename = filename.substring(0, 2);
            // Check again
            if (!file.exist(path.join(dir, filename + '.json'))) {
                filename = options.defaultLocale;
            }
        } else {
            filename = options.defaultLocale;
        }
    }
    // Load the file
    directory = dir;
    filepath = path.join(dir, filename + '.json');
    currentLocale = filename;
    translations = file.loadJson(filepath);
    if (!translations) {
        translations = {};
    }
    return true;
}

function changeLocale(locale) {
    return config(directory, locale);
}

function translate(key) {
    // Get translation
    const keys = key.split('.');
    let translation = translations;
    for (let k of keys) {
        translation = translation[k];
        if (!translation) {
            break;
        }
    }
    // If they are no translation add it in the file
    if (!translation) {
        if (options.add) {
            addTranslation(key);
        }
        translation = key;
    }
    return entities.decode(translation);
}

function addTranslation(key) {
    const keys = key.split('.');
    let data = translations;
    for (let i = 0; i < keys.length; i++) {
        let k = keys[i];
        if (i === keys.length - 1) {
            data[k] = key;
        } else {
            if (!data[k]) {
                data[k] = {};
            }
            data = data[k];
        }
    }
    file.writeJson(filepath, translations);
}

module.exports = {
    option: option,
    config: config,
    change: changeLocale,
    translate: translate,
    _: translate
}