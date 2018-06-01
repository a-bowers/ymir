
export class PyException extends Error {
    public static map = {};

    public static is(err: Error, errName: string) {
        return err.name === errName;
    }
}
