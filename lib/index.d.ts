/// <reference types="express" />
import * as E from 'express';
import { IWSGIFunction } from './WSGI';
export declare function middleware(module: [string, string] | IWSGIFunction): (req: E.Request, res: E.Response, next: E.NextFunction) => void;
