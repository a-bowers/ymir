import * as E from 'express';
import { IDict } from './IDict';
import { IPyIterable } from './python/Iterator';
import { toPythonEnv } from './toPythonEnv';

// I have no words
export type IWSGIHeaderValue = [string, string];
export type IWSGIExecInfo = [number, string, any] | undefined;

export type IWSGIStartResponse = (
    status: string,
    responseHeaders: IWSGIHeaderValue[],
    execInfo: IWSGIExecInfo
) => (data: Buffer) => void;
export type IWSGIFunction = (
    env: IDict,
    startResponse: IWSGIStartResponse
) => IPyIterable | undefined | [string];

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
    ) {
        // As this is going to go really far places
        // its better to bind it.
        this.start_response = this.start_response.bind(this);
    }

    public writeIter(iter: Iterable<Buffer | string | null>) {
        for (const part of iter) {
            if (part) {
                this.write(part);
            }
        }
        this.res.end();
    }

    public write(data: Buffer | string) {
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
        // Hack as the native module doesn't auto convert it to array
        pythonHeaders = pythonHeaders.valueOf!() as any;

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

    get env(): IDict<any> {
        return toPythonEnv(this.req);
    }

    private _writeStatusAndHeaders() {
        if (!this.responseBucket) {
            throw new Error('write() was invoked before start_response()');
        }

        const { code, headers, message } = this.responseBucket;
        this.res.statusMessage = message;
        this.res.statusCode = code;
        this.res.set(headers);
    }
}
