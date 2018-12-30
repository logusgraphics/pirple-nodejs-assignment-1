/*
 * Server Environment and Configuration
 */
const fs = require('fs');

const httpsOptions = {
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/cert.pem')
};

const environments = {
    staging: {
        servers: [
            {
                protocol: 'http',
                port: 3000
            },
            {
                protocol: 'https',
                port: 3001,
                options: httpsOptions
            },
        ],
        envName: 'staging'
    },
    production: {
        servers: [
            {
                protocol: 'http',
                port: 5000
            },
            {
                protocol: 'https',
                port: 5001,
                options: httpsOptions
            },
        ],
        envName: 'production'
    }
};

const currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
const environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;
