/// <reference types="node" />
import { Writable } from 'stream';
export declare class BytesIOStream extends Writable {
    private readonly bytesIObuffer;
    constructor(initialLength?: number);
    _write(buf: Buffer | null): void;
    readonly ref: any;
}
