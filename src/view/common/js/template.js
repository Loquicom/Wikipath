// Get html and create template
const html = document.getElementById('template').innerHTML;
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
                    data[k] = _(key);
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

// Add translation to the scope and compile template with translations
scope['_'] = translations;
document.getElementById('template').innerHTML = template(scope);