import * as E from 'express';
import { IDict } from './IDict';
import python from './python';
import { IWSGIExecInfo, IWSGIFunction, IWSGIHeaderValue, WSGI } from './WSGI';

/**
 *
 * @param module string in format module.name:function
 * @param module IWSGIFunction
 */
export function middleware(module: string | IWSGIFunction) {
    let wsgiFunc: IWSGIFunction;

    if (typeof module === 'string') {
        const [file, variable] = module.split(':');
        wsgiFunc = python.import(file)[variable];
    } else {
        wsgiFunc = module;
    }

    if (!wsgiFunc) {
        throw new Error('Module did not result into a function');
    }

    return function WSGIMiddleWareAdapter(
        req: E.Request,
        res: E.Response,
        next: E.NextFunction
    ) {
        try {
            const wsgi = new WSGI(req, res);
            wsgi.execute(wsgiFunc);
        } catch (e) {
            next(e);
        }
    };
}

export * from './python';
