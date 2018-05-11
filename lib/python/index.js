"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const python = require("python.node");
exports.instance = python;
const sys = python.import('sys');
sys.path.append(process.cwd());
__export(require("./PyException"));
__export(require("./Iterator"));
__export(require("./io"));
__export(require("./BytesIOStream"));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcHl0aG9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0NBQXNDO0FBYW5CLDBCQUFRO0FBUjNCLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFFL0IsbUNBQThCO0FBQzlCLGdDQUEyQjtBQUMzQiwwQkFBcUI7QUFDckIscUNBQWdDIn0=