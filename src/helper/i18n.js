// Imports
const preferredLocale = require('preferred-locale');
const path = require('path');
const Entities = require('html-entities').AllHtmlEntities;
const file = require('./file');

// Variables
const entities = new Entities();

class i18n {

    #baseDir;
    #fileList = {};
    #locale;
    #options = {
        defaultLocale: 'en',
        add: true
    };
    #translation = {};

    constructor(srcDir, locale = null, options = null) {
        // Set the options and the base directory
        if (options) {
            this.#options.defaultLocale = options.defaultLocale || this.#options.defaultLocale;
            this.#options.add = options.add !== undefined ? options.add : this.#options.add;
        }
        this.#baseDir = srcDir;
        // Find all translation files
        if (!file.exist(srcDir) || !file.isDir(srcDir)) {
            throw srcDir + 'is not a directory';
        }
        this.#listFiles(srcDir);
        // List all the locales available and get the preferred local
        const listLocales = [];
        for (const localeInfo of this.getLocales()) {
            listLocales.push(localeInfo.code);
        }
        const systemLocal = preferredLocale(listLocales, this.#options.defaultLocale, { lowerCaseRegion: true });
        const selectedLocale = locale ? locale : systemLocal;
        // Load the file for the locale
        const actualLocale = this.changeLocale(selectedLocale);
        if (!actualLocale) {
            throw `No translation file found for the locale: ${selectedLocale}, and the defaultLocale: ${this.#options.defaultLocale}. Add file for the locale or set the add option to true`;
        }
    }

    changeLocale(localeCode) {
        // Check if file exist for the locale
        let create = false;
        if (this.#fileList[localeCode] === undefined) {
            // If it's a specific version for a country check the base version
            if (localeCode.length > 2 && localeCode[2] === '-') {
                const newLocale = localeCode.substring(0, 2);
                if (this.#fileList[newLocale] === undefined) {
                    create = true
                } else {
                    // Change the locale
                    localeCode = newLocale;
                }
            } else {
                create = true;
            }
            // If no file is found and add option is set to true create the file
            if (create && this.#options.add) {
                file.put(path.join(this.#baseDir, localeCode + '.json'));
                this.#fileList[localeCode] = {
                    code: localeCode,
                    name: localeCode,
                    path: path.join(this.#baseDir, localeCode + '.json')
                }
            } 
            // If add is set to false use the defaultLocale
            else if (create) {
                if (this.#fileList[this.#options.defaultLocale] === undefined) {
                    return false;
                }
                localeCode = this.#options.defaultLocale;
            }
        }
        // Set the locale and read the file
        this.#locale = localeCode;
        this.#translation = file.loadJson(this.#fileList[this.#locale].path, true);
        if (!this.#translation) {
            this.#translation = {};
        }
        return this.#locale;
    }

    getLocales() {
        const res = [];
        for(const key in this.#fileList) {
            res.push({
                name: this.#fileList[key].name,
                code: this.#fileList[key].code,
                localeName: this.#getLangLocaleName(this.#fileList[key].code),
            });
        }
        return res;
    }

    getCurrentLocale() {
        return this.#locale;
    }

    _(key, params = {}) {
        return this.translate(key, params);
    }

    translate(key, params = {}) {
        if (!this.#locale) {
            return false;
        }
        // Get translation
        const keys = key.split('.');
        let translation = this.#translation;
        for (let k of keys) {
            translation = translation[k];
            if (!translation) {
                break;
            }
        }
        // If they are no translation add it in the file
        if (!translation) {
            if (this.#options.add) {
                this.#addTranslation(key);
            }
            translation = key;
        }
        // Get the value and replace variables
        let result = entities.decode(translation);
        for(let keyParam in params) {
            result = result.replaceAll('${' + keyParam + '}', params[keyParam]);
        }
        return result;
    }

    #listFiles(dirPath) {
        const regex = /.*\.?.+\.json/gm;
        const files = file.list(dirPath);
        for(const f of files) {
            if (f.match(regex)) {
                const split = f.split('.');
                const filepath = path.join(dirPath, f);
                if (split.length === 3) {
                    this.#fileList[split[1]] = {
                        code: split[1],
                        name: split[0],
                        path: filepath
                    }
                } else {
                    this.#fileList[split[0]] = {
                        code: split[0],
                        name: split[0],
                        path: filepath
                    }
                }
            }
        }
    }

    #getLangLocaleName(localeCode) {
        const translationKey = `lang.${localeCode}`;
        const addOption = this.#options.add;
        // Get the lang value (don't add a value is the lang is not found)
        this.#options.add = false;
        let localeName = this.translate(translationKey);
        this.#options.add = addOption;
        // Return null if the lang is not found
        if (!localeName || localeName === translationKey) {
            localeName = null;
        }
        return localeName;
    }

    #addTranslation(key) {
        // Add the new translation
        const keys = key.split('.');
        let data = this.#translation;
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
        file.writeJson(this.#fileList[this.#locale].path, this.#translation);
    }

}

class i18nFactory {

    options = {
        defaultLocale: 'en',
        add: true
    };

    #i18n = null;

    create(srcDir, locale = null, options = null) {
        options = options || this.options;
        if (this.#i18n === null) {
            this.#i18n = new i18n(srcDir, locale, options);
        }
        return this.#i18n;
    }

    get() {
        return this.#i18n;
    }

}

module.exports = new i18nFactory();