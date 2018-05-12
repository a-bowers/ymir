import { Readable } from 'stream';
import { IPyIterable, iterate } from './python';

export class WSGIResponseStream extends Readable {
    public async consume(generator: IPyIterable<Buffer | string>) {
        const iterable = iterate(generator);

        for (const chunk of iterable) {
            this.push(chunk);
        }
    }

    public _read() {
        // noop
    }
}
