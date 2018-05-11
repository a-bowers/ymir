import { PyException } from './PyException';

export interface IPyIterable<T = string> {
    next(): T;
}

export function* iterate<T = string>(iter: IPyIterable<T>) {
    try {
        while (true) {
            yield iter.next();
        }
    } catch (e) {
        // @TODO: Somehow Automate this
        const err = PyException.Intercept(e);
        if (err instanceof PyException) {
            if (err.name === 'StopIteration') {
                return null;
            }
        }
        throw err;
    }
}
