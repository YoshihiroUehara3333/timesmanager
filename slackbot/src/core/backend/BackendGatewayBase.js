// src/core/backend/BackendGatewayBase.js

class BackendGatewayBase {
    constructor(backendHttpClient) {
        this.backendHttpClient = backendHttpClient
    }
}

module.exports = { BackendGatewayBase }