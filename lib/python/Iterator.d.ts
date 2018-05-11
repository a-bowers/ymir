export interface IPyIterable<T = string> {
    next(): T;
}
export declare function iterate<T = string>(iter: IPyIterable<T>): IterableIterator<T | null>;
