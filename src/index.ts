import Python from 'python.node';
import * as E from 'express';
import { toPythonEnv } from './toPythonEnv';
import { WSGIResponseWrapper } from './WSGIResponseWrapper';


export function middleware(module: string, method = 'app') {
    const wsgiModule = Python.import(module);
    const wsgiFunc = wsgiModule[method];

    return function WSGIMiddleWareAdapter(req: E.Request, res: E.Response, next: E.NextFunction) {
        try {
            const env = toPythonEnv(req);
            const wsgiResponseHelper = new WSGIResponseWrapper(res);
            const pythonResponse = wsgiFunc(env, wsgiResponseHelper.start_response);
            wsgiResponseHelper.writeIter(pythonResponse);
        } catch (e) {
            next(e);
        }
    }
}