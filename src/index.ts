import * as E from 'express';
import { IDict } from './IDict';
import { instance, iterate } from './python';
import {
    IWSGIExecInfo,
    IWSGIFunction,
    IWSGIHeaderValue,
    WSGIWrapper,
} from './WSGI';

export function middleware(module: [string, string] | IWSGIFunction) {
    const wsgiFunc: IWSGIFunction = Array.isArray(module)
        ? instance.import(module[0])[module[1]]
        : module;

    return function WSGIMiddleWareAdapter(
        req: E.Request,
        res: E.Response,
        next: E.NextFunction
    ) {
        try {
            const wsgi = new WSGIWrapper(req, res);
            const pythonResponse = wsgiFunc(wsgi.env, wsgi.start_response);
            if (pythonResponse) {
                if (Array.isArray(pythonResponse)) {
                    return wsgi.write(pythonResponse[0]);
                }

                if (pythonResponse.hasOwnProperty('next')) {
                    wsgi.writeIter(iterate(pythonResponse));
                }
            }
        } catch (e) {
            next(e);
        }
    };
}
