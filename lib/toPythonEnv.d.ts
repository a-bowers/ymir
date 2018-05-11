/// <reference types="node" />
/// <reference types="express" />
import * as E from 'express';
import { Stream } from 'stream';
import { IDict } from './IDict';
export declare type ProtocolType = 'http' | 'https';
export interface IPythonEnv {
    SCRIPT_NAME: string;
    REQUEST_METHOD: string;
    PATH: string;
    QUERY_STRING: string;
    CONTENT_TYPE: string;
    CONTENT_LENGTH: string;
    SERVER_NAME: string;
    SERVER_PORT: string;
    SERVER_PROTOCOL: string;
    HTTPS: 'on' | 'off';
    SSL_PROTOCOL: string;
    'wsgi.version': any;
    'wsgi.url_scheme': ProtocolType;
    'wsgi.input': Stream;
    'wsgi.errors': Stream;
    'wsgi.multithread': boolean;
    'wsgi.multiprocess': boolean;
    'wsgi.run_once': boolean;
    [key: string]: any;
}
export declare function headerToWSGIVar(header: string): string;
export declare function toPythonEnv(req: E.Request): IDict<any>;
