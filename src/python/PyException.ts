export interface IPyError extends Error {
    pyErrorName: string;
}

export class PyException extends Error {
    public static map = {};

    public static is(err: Error | IPyError, errName: string) {
        return (err as IPyError).pyErrorName === errName;
    }

    public static convert(err: Error | IPyError) {
        if ((err as IPyError).pyErrorName) {
            return new PyException(err as IPyError);
        }
        return err;
    }

    public readonly name: string;
    constructor(err: IPyError) {
        super(err.message);
        this.name = (err as any).pyErrorName;
    }
}
