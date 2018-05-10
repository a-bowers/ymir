import * as Python from 'python.node';
import * as E from 'express';
import {
    WSGIWrapper,
    IWSGIHeaderValue,
    IWSGIExecInfo,
    IWSGIFunction,
} from './WSGI';
import { IDict } from './IDict';

export function middleware(module: [string, string] | IWSGIFunction) {
    const wsgiFunc: IWSGIFunction = Array.isArray(module)
        ? Python.import(module[0])[module[1]]
        : module;

    return function WSGIMiddleWareAdapter(
        req: E.Request,
        res: E.Response,
        next: E.NextFunction
    ) {
        try {
            const wsgi = new WSGIWrapper(req, res);
            const pythonResponse = wsgiFunc(wsgi.env, wsgi.start_response);
            setTimeout(() => {
                wsgi.writeIter((pythonResponse as any).valueOf() as Array<
                    string
                >);
            }, 4);
        } catch (e) {
            next(e);
        }
    };
}
