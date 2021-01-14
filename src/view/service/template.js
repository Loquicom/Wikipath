// Imports
const $ = require('jquery');
const Handlebars = require('handlebars');
const i18nFactory = require('../../helper/i18n');
const storage = require('./storage');

// Variables
const locale = storage.get('locale') ? storage.get('locale') : null;
const i18n = i18nFactory.create(path.join(__dirname, '../../../locales'), locale);

class TemplateService {

    getLocales() {
        return i18n.getLocales();
    }

    changeLocale(locale) {
        storage.set('locale', locale);
        return i18n.changeLocale(locale);
    }

    translate(key, params = {}) {
        return i18n.translate(key, params)
    }

    _(key, params = {}) {
        return i18n._(key, params);
    }

    generate(html, scope = {}) {
        // Compile html into template
        const template = Handlebars.compile(html);
        // Extract translation key
        const regex = /(?<={{_\.)([a-zA-Z.]*)(?=}})/gm;
        const keys = html.match(regex);
        const translations = {};
        if (keys) {
            for (let key of keys) {
                const keySplit = key.split('.');
                if (keySplit.length === 1) {
                    translations[key] = i18n._(key);
                } else {
                    let data = translations;
                    for(let i = 0; i < keySplit.length; i++) {
                        const k = keySplit[i];
                        if (i === keySplit.length - 1) {
                            data[k] = i18n.translate(key);
                        } else {
                            if (!data[k]) {
                                data[k] = {}
                            }
                            data = data[k]
                        }
                    }
                }
            }
        }
        // Add translation key into the scope
        scope['_'] = translations;
        // Return generate html
        return template(scope);
    }

}

module.exports = new TemplateService();