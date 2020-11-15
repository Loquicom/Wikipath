// Import
const WebSocket = require('ws');

// Class client
class Client {

    #ws = null;
    #addr;
    #port;
    #event = {};
    #action = {};
    #pingTimeout;

    constructor(addr, port = 8080) {
        this.#addr = addr;
        this.#port = port;
    }

    on(event, callback) {
        if (typeof callback === 'function') {
            this.#event[event] = callback;
        }
    }

    action(action, callback) {
        if (typeof callback === 'function') {
            this.#action[action] = callback;
        }
    }

    connect(callback = null) {
        this.#ws = new WebSocket(`ws://${this.#addr}:${this.#port}`);
        // When connection is open call callback
        this.#ws.on('open', () => {
            if (typeof callback === 'function') {
                callback();
            }
            // Start broken detection
            this._brokenConnection();
        });
        // Handle ping
        this.#ws.on('ping', () => {
            this._brokenConnection();
        });
        // Handle error
        this.#ws.on('error', (err) => {
            if (typeof this.#event.error === 'function') {
                this.#event.error(err);
            }
        });
        // Handle message
        this.#ws.on('message', (msg) => {
            // Parse message
            const data = this._jsonParse(msg);
            if (!data) return;
            // Use correct action
            const action = this.#action[data.action] ? this.#action[data.action] : this.#action.default;
            if (typeof action === 'function') {
                action(
                    data.data, 
                    (respond = {}) => {
                        this.send(data.action, respond);
                    }, 
                    this
                );
            }
        });
        // Clear timeout when server close
        this.#ws.on('close', () => {
            clearTimeout(this.#pingTimeout);
        });
    }

    send(action, data = {}) {
        this._isConnected();
        this.#ws.send(JSON.stringify({action: action, data: data}));
    }

    close(callback = null) {
        this._isConnected();
        // Close connection
        this.#ws.close();
        // Callback
        if (typeof callback === 'function') {
            callback(this.#ws.clientId);
        }
    }

    _brokenConnection() {
        clearTimeout(this.#pingTimeout);
        // Wait ping from server
        // If no ping is received within a time equivalent to twice that of the server then the connection is broken
        this.#pingTimeout = setTimeout(() => {
            this.#ws.terminate();
            // Call broken
            if (typeof this.#event.broken === 'function') {
                this.#event.broken();
            }
        }, 30000 * 2);
    }

    _jsonParse(data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            return false;
        }
    }

    _isConnected() {
        if (this.#ws === null) {
            throw 'Client not connected';
        }
    }

}

module.exports = Client;