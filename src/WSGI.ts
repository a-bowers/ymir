import * as E from 'express';
import { IDict } from './IDict';
import { IPyIterable, iterate } from './python/Iterator';
import { toPythonEnv } from './toPythonEnv';
import { WSGIResponseStream } from './WSGIResponseStream';

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
) => IPyIterable | { __iter__(): IPyIterable };

export interface IWSGIResponseBucket {
    readonly code: number;
    readonly message: string;
    readonly headers: IDict;
}

export class WSGI {
    public responseBucket: IWSGIResponseBucket | null = null;

    constructor(
        public readonly req: E.Request,
        public readonly res: E.Response
    ) {
        // As this is going to go really far places
        // its better to bind it.
        this.start_response = this.start_response.bind(this);
    }

    public async execute(wsgiFunc: IWSGIFunction) {
        console.log("Calling the function");
        try {
            let pythonResponse = wsgiFunc(this.env, this.start_response);
            console.log("IT WORKED!");    
            if (pythonResponse) {
                if (!pythonResponse.hasOwnProperty('next')) {
                    pythonResponse = (pythonResponse as any).__iter__();
                }
                const stream = new WSGIResponseStream(
                    pythonResponse as IPyIterable
                );
                stream.pipe(this.res);
            }
        } catch (e) {
            console.error(e);
        }
    }

    private writeIter(iter: Iterable<Buffer | string | null>) {
        for (const part of iter) {
            if (part) {
                this.write(part);
            }
        }
        this.res.end();
    }

    private write(data: Buffer | string) {
        console.log("WRITE WAS CALLED");
        if (!this.res.headersSent) {
            this._writeStatusAndHeaders();
        }
        this.res.write(data);
    }

    private start_response(
        pythonStatus: string,
        pythonHeaders: IWSGIHeaderValue[],
        execInfo: IWSGIExecInfo
    ) {
        // Hack as the native module doesn't auto convert it to array
        // pythonHeaders = pythonHeaders.valueOf!() as any;
        console.log("START TO RESPOND~!");
        
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

        for (const tuple of pythonHeaders) {
            const [headerName, headerValue] = tuple.valueOf() as any;
            headers[headerName.valueOf()] = headerValue.valueOf();
        }

        this.responseBucket = {
            code,
            headers,
            message,
        };

        return this.write;
    }

    private get env(): IDict<any> {
        return toPythonEnv(this.req);
    }

    private _writeStatusAndHeaders() {
        if (!this.responseBucket) {
            throw new Error('write() was invoked before start_response()');
        }

        const { code, headers, message } = this.responseBucket;
        this.res.writeHead(code, message, headers);
    }
}
