const handlers = require('./handlers');

let router = {};

router.hello = handlers.hello;

module.exports = router;