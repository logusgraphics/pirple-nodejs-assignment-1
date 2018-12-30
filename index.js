/*
 * Entry point
 */

const http = require('http');
const https = require('https');
const config = require('./config');
const log = require('./log')
const unifiedServer = require('./server');

const servers = config.servers;

servers.forEach(server => {
    let served;
    switch (server.protocol) {
        case 'https':
            served = https.createServer(server.options, unifiedServer);
            break;
        case 'http':
            served = http.createServer(unifiedServer);
            break;
    }
    served.listen(server.port, log(`The HTTP server is running on port: ${server.port}`));
});
