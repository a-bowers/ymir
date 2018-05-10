import * as E from 'express';
import { IDict } from './IDict';
import { toPythonEnv } from './toPythonEnv';

// I have no words
export type IWSGIHeaderValue = [string, string];
export type IWSGIExecInfo = [number, string, any] | undefined;

export type IWSGIStartResponse = (status: string, responseHeaders: IWSGIHeaderValue[], execInfo: IWSGIExecInfo) => (data: Buffer) => void;
export type IWSGIFunction = (env: IDict, startResponse: IWSGIStartResponse) => Iterable<Buffer>;

export interface IWSGIResponseBucket {
    readonly code: number;
    readonly message: string;
    readonly headers: IDict;
}


export class WSGIWrapper {
    public responseBucket: IWSGIResponseBucket | null = null;     
    
    constructor(
        public readonly req: E.Request,
        public readonly res: E.Response
    ) {}

    public writeIter(iter: Iterable<Buffer>) {
        throw new Error('Not implemented yet, no idea wtf is this');
    }

    public write(data: Buffer) {
        if (!this.res.headersSent) {
            this._writeStatusAndHeaders();
        }
        this.res.write(data);
    }

    public start_response(
        pythonStatus: string, 
        pythonHeaders: IWSGIHeaderValue[], 
        execInfo: IWSGIExecInfo
    ) {
        if (execInfo !== undefined) {
            if (this.res.headersSent) {
                throw new Error(execInfo[1]);
            }
        } else if (this.responseBucket) {
            throw new Error('Headers already set, start_response called twice');
        }

        const parts = pythonStatus.split(' ');
        const code = parseInt(parts[0], 10);
        const message = parts[1];
        const headers: IDict = {};

        for (const [headerName, headerValue] of pythonHeaders) {
            headers[headerName] = headerValue;
        }

        this.responseBucket = {
            code, 
            headers,
            message,
        };

        return this.write;
    }

    get env() {
        return toPythonEnv(this.req);
    }

    private _writeStatusAndHeaders() {
        if (!this.responseBucket) {
            throw new Error('write() was invoked before start_response()');
        }

        const {code, headers, message} = this.responseBucket;
        this.res.status(code).send(message);
        this.res.set(headers);    
    }
}