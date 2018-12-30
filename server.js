const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const log = require('./log');
const router = require('./router');
const handlers = require('./handlers');

const server = function (req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const path = pathname.replace(/^\/+|\/+$/g, '');
    const params = parsedUrl.query;
    const method = req.method.toLowerCase();
    const headers = req.headers;
    const decoder = new StringDecoder('utf-8');
    let data = '';

    req.on('data', function (data) {
        data += decoder.write(data);
    });

    req.on('end', function () {
        data += decoder.end();
        const handler = typeof (router[path]) !== 'undefined' ? router[path] : handlers.notFound;
        const response = { path, params, method, headers, data };
        handler(response, function (statusCode, payload) {
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
            payload = typeof (payload) == 'object' ? payload : {};
            const payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            log(`Returning response with status code: ${statusCode} + and payload: ${payloadString}`);
        });

    });
};

module.exports = server;