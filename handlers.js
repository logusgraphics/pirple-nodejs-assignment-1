const hello = function (data, callback) {
    callback(200, { message: 'Hello earthlings, greetings from Mars.' });
};

const notFound = function (data, callback) {
    callback(404);
}

module.exports = { hello, notFound };