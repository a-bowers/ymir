import * as E from 'express';
import { IDict } from './IDict';
import { instance, IPyIterable, iterate, len, PyType } from './python';
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

            // There are cases where start_response may not be called
            // we need to pull a bjoern on this one

            if (pythonResponse) {
                // If a single element with only 1 element is returned
                if (
                    PyType.is(pythonResponse, 'list') &&
                    len(pythonResponse) === 1
                ) {
                    // This is very ugly
                    return wsgi.write((pythonResponse.valueOf() as any)[0]);
                }

                if (pythonResponse.hasOwnProperty('next')) {
                    const generator = iterate(pythonResponse as IPyIterable);
                    return wsgi.writeIter(generator);
                }
            }
        } catch (e) {
            next(e);
        }
    };
}
