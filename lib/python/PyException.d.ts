export interface IPyError extends Error {
    pyErrorName: string;
}
export declare class PyException extends Error {
    static map: {};
    static Intercept(err: Error | IPyError): Error;
    readonly name: string;
    constructor(err: IPyError);
}
