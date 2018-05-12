import { Readable } from 'stream';
import { IPyIterable, iterate } from './python';

export class WSGIResponseStream extends Readable {
    private readonly iterable: Iterable<Buffer | string>;

    constructor(generator: IPyIterable<Buffer | string>) {
        super();
        this.iterable = iterate(generator);
    }

    public _read() {
        // noop
        this._start();
        this._read = () => {
            // noop
        };
    }

    private async _start() {
        for (const chunk of this.iterable) {
            this.push(chunk);
        }
        this.push(null);
    }
}
