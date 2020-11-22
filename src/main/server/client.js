// Import
const WebSocket = require('ws');

const DEFAULT_PORT = 8080

// Class client
class Client {

    #ws = null;
    #addr;
    #port;
    #protocolVersion;
    #event = {};
    #action = {};
    #pingTimeout;
    #connected = false;
    #selfClosed = false;

    constructor(addr, port = null, protocolVersion = 1) {
        this.#addr = addr;
        this.#port = port ? port : DEFAULT_PORT;
        this.#protocolVersion = protocolVersion;
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
            this.#connected = true;
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
            // System action
            if (data.action.startsWith('#system.server')) {
                switch (data.action) {
                    case '#system.server.stop':
                        // Server is stopping
                        this.#selfClosed = true;
                        if (typeof this.#event.serverstop === 'function') {
                            this.#event.serverstop();
                        }
                        break;
                    case '#system.server.protocol':
                        // Check protocol version
                        if (this._sameProtocolVersion(data.data.protocol)) {
                            // Trigger connect callback after protocol verification
                            if (typeof callback === 'function') {
                                callback();
                            }
                        }
                        break;
                    default:
                        // Unknown server action === bad protocol version
                        this._sameProtocolVersion(-1);
                }
                
            } 
            // Use custom action
            else {
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
            }
        });
        // Clear timeout when server close
        this.#ws.on('close', () => {
            if (this.#connected) {
                if (!this.#selfClosed && typeof this.#event.disconnection === 'function') {
                    this.#event.disconnection();
                }
                clearTimeout(this.#pingTimeout);
            } else {
                if (typeof this.#event.notfound === 'function') {
                    this.#event.notfound();
                }
            }
        });
    }

    send(action, data = {}) {
        this._isConnected();
        this.#ws.send(JSON.stringify({action: action, data: data}));
    }

    close(callback = null) {
        this._isConnected();
        // Close connection
        this.#selfClosed = true;
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

    _sameProtocolVersion(version) {
        // If version is not the same close connection
        if (version != this.#protocolVersion) {
            this.close();
            // Call bad protocol
            if (typeof this.#event.badprotocol === 'function') {
                this.#event.badprotocol(version);
            }
            return false;
        }
        return true;
    }

}

module.exports = Client;