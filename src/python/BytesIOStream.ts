import { Writable } from 'stream';
import { io } from '.';

export class BytesIOStream extends Writable {
    private readonly bytesIObuffer: any;

    constructor(initialLength?: number) {
        super();
        this.bytesIObuffer = io.BytesIO();
    }

    public _write(buf: Buffer | null) {
        if (buf == null) {
            this.bytesIObuffer.close();
            return;
        }
        this.bytesIObuffer.write(buf.toString('utf8'));
    }

    get ref() {
        return this.bytesIObuffer;
    }
}
