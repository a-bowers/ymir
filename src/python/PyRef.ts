import { IPyObject } from './IPyObject';

const handler = {
    get(self: any, key: string) {
        if (!self.__attr__[key]) {
            self.__attr__[key] = PyRef(self.ref.getAttr(key));
        }
        return self.__attr__[key];
    },

    apply(self: any, thisArg: any, args: any[]): any {
        return PyRef(self.ref.call(...args));
    },
};

export function PyRef(pyObject: IPyObject | undefined) {
    if (!pyObject) {
        return undefined;
    }
    const callable = (() => {
        // we will assume for now everything is callable
        // In future pyObject should return a function
        // type instead of pureObject types
    }) as any;

    callable.__attr__ = {};
    callable.ref = pyObject;

    return new Proxy(callable, handler);
}
