export interface IPyError extends Error {
    pyErrorName: string;
}
export declare class PyException extends Error {
    static map: {};
    static is(err: Error | IPyError, errName: string): boolean;
    static convert(err: Error | IPyError): Error;
    readonly name: string;
    constructor(err: IPyError);
}
