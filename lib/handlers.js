let handlers = {};

handlers._hello = {
    post: function(data, callback){
        callback(200, { message: 'Hello earthlings, greetings from Mars.' });
    }
};

handlers.hello = function (data, callback) {
    const allowed = ['post'];
    if (allowed.indexOf(data.method) > -1) {
        handlers._hello[data.method](data, callback);
    } else {
        handlers.notFound(data, callback);
    }
};

handlers.notFound = function (data, callback) {
    callback(404);
}

module.exports = handlers;