const py = require('../lib/python').instance;
const sys = py.import("sys");
sys.stdout.write("Hello World");
