const ymir = require('../lib');
const func = ymir.middleware('tests.fl:app');
const webtask = require('webtask-tools');

module.exports = webtask.fromExpress(func);