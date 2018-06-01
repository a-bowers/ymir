const ymir = require('../lib');
const webtask = require('webtask-tools');

const func = ymir.middleware('wsgiref.simple_server:demo_app');

// console.log(func, func.apply);
// func.apply(func, [{}, console.log.bind(console)]);

module.exports = webtask.fromExpress(func);