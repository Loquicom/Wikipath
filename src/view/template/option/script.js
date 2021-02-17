// Variables
scope.optionDialog = dialogService.newDialog('option', {type: 'primary', label: _('common.close')}, 'center');

// Functions
function back() {
    routerService.redirect('menu', scope);
}

function changeLocale() {
    const locale = $('#lang-select').val();
    template.changeLocale(locale);
    storage.set('locale', locale);
    routerService.redirect('option', scope);
}

function fullScreen() {
    let val;
    $('input[name=fullscreen]').each((index, elt) => {
        if ($(elt).prop('checked')) {
            val = $(elt).val() === "true" ? true : false;
        }
    });
    if (val !== undefined) {
        storage.set('fullscreen', val);
        ipcRenderer.send('full-screen', val);
    }
}

function clearCache() {
    // Clear storage and set the correct devMode
    const devMode = storage.get('dev');
    storage.clear();
    storage.set('dev', devMode);
    // Show popup
    if (!scope.optionDialog.isOpen()) {
        scope.optionDialog.open(_('option.cache.success'));
    }
}

function credit() {
    routerService.redirect('credit', scope);
}

function apply() {
    fullScreen();
    changeLocale();
}

// When DOM is ready
$(() => {
    // Generate select options
    const locales = template.getLocales();
    const current = template.getCurrentLocale();
    let html = '';
    for (const locale of locales) {
        const selected = locale.code === current ? ' selected' : '';
        html += `<option value="${locale.code}"${selected}>${locale.name}</option>\n`;
    }
    $('#lang-select').html(html);
    // Checked the correct value for full screen
    const fullscreen = storage.get('fullscreen')
    if (fullscreen) {
        $('#fullscreen-true').prop('checked', true);
    } else {
        $('#fullscreen-false').prop('checked', true);
    }
});