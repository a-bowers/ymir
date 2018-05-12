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
        if (PyException.is(e, 'StopIteration')) {
            // In node land we'll just return
            return;
        }
        throw e;
    }
}
