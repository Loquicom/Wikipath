// Variables
const result = storage.get('result');
scope.server = {name: storage.get('server-name')};

// Functions
function generateResult(result) {
    let html = '';
    for(let res of result) {
        html += '<tr>';
        html += `<td>${res.pos}</td>`;
        html += `<td>${res.pseudo}</td>`;
        html += `<td><button class="nes-btn is-primary" data-pos="${res.pos}">${_('result.view')}</button></td>`;
        html += '</tr>';
    }
    return html;
}

// DOM Ready
$(() => {
    $('#result-content').html(generateResult(result));
});