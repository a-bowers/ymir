const ymir = require('../lib');
const func = ymir.func('tests.wt:app');

// console.log(func, func.apply);
// func.apply(func, [{}, console.log.bind(console)]);

module.exports = function (ctx, cb) {
    console.log(ctx);
    return func(ctx, cb);
}