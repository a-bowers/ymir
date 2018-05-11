"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const python_1 = require("./python");
const WSGI_1 = require("./WSGI");
function middleware(module) {
    const wsgiFunc = Array.isArray(module)
        ? python_1.instance.import(module[0])[module[1]]
        : module;
    return function WSGIMiddleWareAdapter(req, res, next) {
        try {
            const wsgi = new WSGI_1.WSGIWrapper(req, res);
            const pythonResponse = wsgiFunc(wsgi.env, wsgi.start_response);
            if (pythonResponse) {
                if (Array.isArray(pythonResponse)) {
                    return wsgi.write(pythonResponse[0]);
                }
                if (pythonResponse.hasOwnProperty('next')) {
                    wsgi.writeIter(python_1.iterate(pythonResponse));
                }
            }
        }
        catch (e) {
            next(e);
        }
    };
}
exports.middleware = middleware;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxxQ0FBNkM7QUFDN0MsaUNBS2dCO0FBRWhCLG9CQUEyQixNQUF3QztJQUMvRCxNQUFNLFFBQVEsR0FBa0IsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDakQsQ0FBQyxDQUFDLGlCQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBRWIsT0FBTywrQkFDSCxHQUFjLEVBQ2QsR0FBZSxFQUNmLElBQW9CO1FBRXBCLElBQUk7WUFDQSxNQUFNLElBQUksR0FBRyxJQUFJLGtCQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZDLE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUMvRCxJQUFJLGNBQWMsRUFBRTtnQkFDaEIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFO29CQUMvQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3hDO2dCQUVELElBQUksY0FBYyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRTtvQkFDdkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7aUJBQzNDO2FBQ0o7U0FDSjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ1g7SUFDTCxDQUFDLENBQUM7QUFDTixDQUFDO0FBMUJELGdDQTBCQyJ9