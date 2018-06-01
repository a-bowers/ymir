import { IPyObject } from './IPyObject';
import createLogger from '../logger';

const logger = createLogger('pyref');

const handler: any = {
    get(self: any, key: string) {
        return self.__attr__[key] || PyRef(self.ref.getAttr(key));
    },

    set(self: any, key: string, value: any) {
        if (!self.__attr__[key]) {
            self.setAttr(key, value);            
        }

        return value;
    },

    has(self: any, key: string) {
        return !!self[key];
    },

    apply(self: any, thisArg: any, args: any[]) {
        return PyRef(self.ref.call(...args));
    }
};

export function PyRef(pyObject: IPyObject | undefined) {
    if (!pyObject) {
        return undefined;
    }

    // This is a base JS Object
    if (!pyObject.getAttr) {
        return pyObject;
    }

    const instance = (() => {
        // noop
    }) as any;

    instance.__attr__ = {
        // We may need a better solution than this
        // I need to understand exactly what each Symbol.x means
        [Symbol.toPrimitive]: pyObject.toString.bind(pyObject),

        [Symbol.toStringTag]: pyObject.toString.bind(pyObject),
        toString: pyObject.toString.bind(pyObject),
        valueOf: pyObject.valueOf.bind(pyObject),
        apply: (thisArg: any, args: any[] = []) =>
            PyRef(instance.ref.call(...args)),
        call: (thisArg: any, ...args: any[]) =>
            PyRef(instance.ref.call(...args)),
    };

    instance.ref = pyObject;
    return new Proxy(instance, handler);
}
