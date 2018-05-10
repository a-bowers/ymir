"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Python = require("python.node");
const WSGI_1 = require("./WSGI");
function middleware(module) {
    const wsgiFunc = Array.isArray(module)
        ? Python.import(module[0])[module[1]]
        : module;
    return function WSGIMiddleWareAdapter(req, res, next) {
        try {
            const wsgi = new WSGI_1.WSGIWrapper(req, res);
            const pythonResponse = wsgiFunc(wsgi.env, wsgi.start_response);
            setTimeout(() => {
                wsgi.writeIter(pythonResponse.valueOf());
            }, 4);
        }
        catch (e) {
            next(e);
        }
    };
}
exports.middleware = middleware;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBc0M7QUFFdEMsaUNBS2dCO0FBR2hCLG9CQUEyQixNQUF3QztJQUMvRCxNQUFNLFFBQVEsR0FBa0IsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDakQsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFFYixPQUFPLCtCQUNILEdBQWMsRUFDZCxHQUFlLEVBQ2YsSUFBb0I7UUFFcEIsSUFBSTtZQUNBLE1BQU0sSUFBSSxHQUFHLElBQUksa0JBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDdkMsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQy9ELFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ1osSUFBSSxDQUFDLFNBQVMsQ0FBRSxjQUFzQixDQUFDLE9BQU8sRUFFN0MsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ1Q7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNSLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNYO0lBQ0wsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQXRCRCxnQ0FzQkMifQ==