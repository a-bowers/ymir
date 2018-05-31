const py = require('../lib/python').instance;
const demo_app = py.import("wsgiref.simple_server").demo_app;

const env = process.env;



module.exports = function (ctx, callback) {
    const response = demo_app({
        ...env,
        ...ctx,
        "_____________________X_How_to_auth_________________": [
            "Get access token", 
            "Call API"
        ]
    }, function (responseStatus, responseHeaders) {
        // LOW LEVEL API
        console.log("Http Status:", responseStatus);
        console.log("Http Headers:", responseHeaders.valueOf()[0].valueOf().map(k => k.valueOf()));
    });

    callback(null, {
        "response": response.valueOf()[0].valueOf()
    });
}