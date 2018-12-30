const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const log = require('./log');
const router = require('./router');
const handlers = require('./handlers');
const responseHeaders = require('./response-headers');

const server = function (request, response) {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;
    const params = parsedUrl.query;
    const path = pathname.replace(/^\/+|\/+$/g, '');
    const method = request.method.toLowerCase();
    const headers = request.headers;
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    const onData = data => buffer += decoder.write(data);
    const onEnd = () => {
        buffer += decoder.end();
        const handler = typeof (router[path]) !== 'undefined' ? router[path] : handlers.notFound;
        const data = { path, params, method, headers, data: buffer };
        handler(data, function (statusCode, payload) {
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
            payload = typeof (payload) == 'object' ? payload : {};
            const payloadString = JSON.stringify(payload);
            if (responseHeaders && responseHeaders.length) {
                responseHeaders.forEach(header => response.setHeader(header.key, header.value));
            }
            response.writeHead(statusCode);
            response.end(payloadString);
            log(`Returning response with status code: ${statusCode} + and payload: ${payloadString}`);
        });

    };

    request.on('data', onData);
    request.on('end', onEnd);
};

module.exports = server;