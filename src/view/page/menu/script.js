// Imports
const $ = require('jquery');
const router = require ('../../service/router');

// Functions
function host() {

}

function join() {
    const pseudo = $('#pseudo').val();
    // Check if pseudo is not empty
    if (!pseudo.trim()) {
        $('#error-dialog').get()[0].showModal();
        return false;
    }
    localStorage.setItem('pseudo', pseudo);
    // Change to join screen
    router.redirect('join');
}

// Document is ready
$(() => {
    // Set last pseudo in pseudo input
    if (localStorage.getItem('pseudo')) {
        $('#pseudo').val(localStorage.getItem('pseudo'));
    }
});