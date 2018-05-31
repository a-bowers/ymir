const py = require('../lib/python').instance;
const sys = py.import("sys");
const assert = require('assert');

sys.stdout.write("🧛‍♂️ Hello World! \n");

// assert(Array.isArray(sys.path) != true, "sys.path is an array");
// // assert(Array.isArray(sys.path.valueOf()), "valueOf sys.path is not an array");
// // assert(typeof sys.path.valueOf()[0] === 'string', "Path was not string");

// assert(sys.stdout.nonexistent === undefined, "Non existent was defined");

// sys.path.append(process.cwd());

// sys.stdout.write("Running WSGI test\n\n");
// const demo_app = py.import("wsgiref.simple_server").demo_app;

// const env = process.env;

// const response = demo_app(env, function (responseStatus, responseHeaders) {
//     console.log("Http Status:", responseStatus);
//     console.log("Http Headers:", responseHeaders)
// });

// console.log("Response \n \n", response.valueOf()[0].valueOf());

// sys.stdout.write("🧙🏻‍♀️ If you see this then all tests have passed 👋🏻\n");
// sys.stdout.write("Oh and btw first you get the access token then you call the API");