const html = document.getElementById('template').innerHTML;
document.getElementById('template').innerHTML = template.generate(html, scope);