import * as E from 'express';
import { Stream } from 'stream';
import { IDict } from './IDict';
import { BytesIOStream } from './python';

export type ProtocolType = 'http' | 'https';

// https://www.python.org/dev/peps/pep-0333/#environ-variables

export interface IPythonEnv {
    // The following variables must be present, unless their value would be an
    // empty string, in which case they may be omitted, except as otherwise
    // noted below.
    SCRIPT_NAME: string;
    REQUEST_METHOD: string;
    PATH: string;
    QUERY_STRING: string;
    CONTENT_TYPE: string;
    CONTENT_LENGTH: string;
    SERVER_NAME: string;
    SERVER_PORT: string;
    SERVER_PROTOCOL: string;

    // A server or gateway should attempt to provide as many other CGI variables
    // as are applicable. In addition, if SSL is in use, the server or gateway
    // should also provide as many of the Apache SSL environment variables [5]
    // as are applicable, such as HTTPS=on and SSL_PROTOCOL.
    HTTPS: 'on' | 'off';
    SSL_PROTOCOL: string;

    // In addition to the CGI-defined variables, the environ dictionary may also
    // contain arbitrary operating-system "environment variables",
    // and must contain the following WSGI-defined variables:
    'wsgi.version': any;
    'wsgi.url_scheme': ProtocolType;
    'wsgi.input': Stream;
    'wsgi.errors': Stream;
    'wsgi.multithread': boolean;
    'wsgi.multiprocess': boolean;
    'wsgi.run_once': boolean;

    [key: string]: any;
}

export function headerToWSGIVar(header: string) {
    return `HTTP_${header.replace(/\-/g, '_').toUpperCase()}`;
}

export function toPythonEnv(req: E.Request): IDict<any> {
    const env: IPythonEnv = {} as any;
    const { socket } = req;
    const isUnixDomainSocket = typeof socket.address() === 'string';

    env.SCRIPT_NAME = req.baseUrl;
    env.REQUEST_METHOD = req.method;
    env.PATH = req.path;
    env.QUERY_STRING = req.originalUrl.split('?')[1] || '';
    env.CONTENT_TYPE = req.headers['content-type'] || '';
    env.CONTENT_LENGTH = req.headers['content-length'] || '';

    // Good enough for now
    env.SERVER_NAME = isUnixDomainSocket ? '' : socket.localAddress;
    env.SERVER_PORT = isUnixDomainSocket ? '' : socket.localPort.toString(10);
    env.SERVER_PROTOCOL = `HTTP/${req.httpVersion}`;

    env.HTTPS = req.secure ? 'on' : 'off';

    // @TODO: Must provide this if possible
    // env.SSL_PROTOCOL = req.socket
    const body = new BytesIOStream();

    env['wsgi.url_scheme'] = req.protocol as ProtocolType;
    env['wsgi.input'] = body.ref;

    req.pipe(body);

    for (const header of Object.keys(req.headers)) {
        env[headerToWSGIVar(header)] = req.headers[header] || '';
    }

    // Attach Env variables
    Object.assign(env, process.env);

    return env;
}
