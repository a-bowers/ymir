import { IPyObject } from './IPyObject';

// tslint:disable:jsdoc-format
/**
 * All traps are optional. If a trap has not been defined, the default behavior is to forward the operation to the target.

        // tslint:disable-next-line:jsdoc-format
        handler.getPrototypeOf()
            A trap for Object.getPrototypeOf.
        handler.setPrototypeOf()
            A trap for Object.setPrototypeOf.
        handler.isExtensible()
            A trap for Object.isExtensible.
        handler.preventExtensions()
            A trap for Object.preventExtensions.
        handler.getOwnPropertyDescriptor()
            A trap for Object.getOwnPropertyDescriptor.
        handler.defineProperty()
            A trap for Object.defineProperty.
        handler.has()
            A trap for the in operator.
        handler.get()
            A trap for getting property values.
        handler.set()
            A trap for setting property values.
        handler.deleteProperty()
            A trap for the delete operator.
        handler.ownKeys()
            A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
        handler.apply()
            A trap for a function call.
        handler.construct()
            A trap for the new operator.
*/
// tslint:enable:jsdoc-format

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
    };

    instance.ref = pyObject;

    return new Proxy(instance, handler);
}
