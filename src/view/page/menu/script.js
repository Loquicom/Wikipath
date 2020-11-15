// Variable
let dialog = null;

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
    localStorage.setItem('pseudo', pseudo);
    // Change to join screen
    routerService.redirect('join');
}

// Document is ready
$(() => {
    // Set last pseudo in pseudo input
    if (localStorage.getItem('pseudo')) {
        $('#pseudo').val(localStorage.getItem('pseudo'));
    }
    // Create dialog
    dialog = dialogService.createDialogWithContent('error', 'Le pseudo est requis', {type: 'primary', label: 'Fermer'}, 'center');
});