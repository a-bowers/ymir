"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const _1 = require(".");
class BytesIOStream extends stream_1.Writable {
    constructor(initialLength) {
        super();
        this.bytesIObuffer = _1.io.BytesIO();
    }
    _write(buf) {
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
exports.BytesIOStream = BytesIOStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnl0ZXNJT1N0cmVhbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9weXRob24vQnl0ZXNJT1N0cmVhbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFrQztBQUNsQyx3QkFBdUI7QUFFdkIsbUJBQTJCLFNBQVEsaUJBQVE7SUFHdkMsWUFBWSxhQUFzQjtRQUM5QixLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3RDLENBQUM7SUFFTSxNQUFNLENBQUMsR0FBa0I7UUFDNUIsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFO1lBQ2IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUMzQixPQUFPO1NBQ1Y7UUFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELElBQUksR0FBRztRQUNILE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUM5QixDQUFDO0NBQ0o7QUFuQkQsc0NBbUJDIn0=