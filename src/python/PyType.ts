export class PyType {
    public static is(obj: any, typename: string) {
        const name = obj.__class__ ? obj.__class__.__name__ : obj.__name__;
        return name === typename;
    }
}
