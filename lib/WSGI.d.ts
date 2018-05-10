/// <reference types="node" />
/// <reference types="express" />
import * as E from 'express';
import { IDict } from './IDict';
export declare type IWSGIHeaderValue = [string, string];
export declare type IWSGIExecInfo = [number, string, any] | undefined;
export declare type IWSGIStartResponse = (status: string, responseHeaders: IWSGIHeaderValue[], execInfo: IWSGIExecInfo) => (data: Buffer) => void;
export declare type IWSGIFunction = (env: IDict, startResponse: IWSGIStartResponse) => Iterable<Buffer>;
export interface IWSGIResponseBucket {
    readonly code: number;
    readonly message: string;
    readonly headers: IDict;
}
export declare class WSGIWrapper {
    readonly req: E.Request;
    readonly res: E.Response;
    responseBucket: IWSGIResponseBucket | null;
    constructor(req: E.Request, res: E.Response);
    writeIter(iter: Iterable<Buffer | string>): void;
    write(data: Buffer | string): void;
    start_response(pythonStatus: string, pythonHeaders: IWSGIHeaderValue[], execInfo: IWSGIExecInfo): (data: string | Buffer) => void;
    readonly env: {
        [key: string]: string;
    };
    private _writeStatusAndHeaders();
}
