// Functions
function host() {

}

function join() {
    const pseudo = $('#pseudo').val();
    // Check if pseudo is not empty
    if (!pseudo.trim()) {
        dialog.open();
        return false;
    }
    storage.set('pseudo', pseudo);
    // Change to join screen
    routerService.redirect('join', scope);
}

function option() {
    routerService.redirect('option');
}

// Document is ready
$(() => {
    // Set last pseudo in pseudo input
    if (storage.exist('pseudo')) {
        $('#pseudo').val(storage.get('pseudo'));
    }
    // Create dialog
    dialog = dialogService.createDialogWithContent('error', _('menu.error.pseudo'), {type: 'primary', label: _('common.close')}, 'center');
    // Enter key press
    $(document).enterKey(() => {
        join();
    });
    // Focus pseudo input
    $('#pseudo').trigger('focus');
});