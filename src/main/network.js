// Imports
const Client = require('./server/client');

// Functions
function join(ip, pseudo) {
    console.log(ip, pseudo);
}

// Events
wikipathEvent.on('connection', (ip, pseudo) => {
    join(ip, pseudo);
    wikipathEvent.emit('server-join');
});