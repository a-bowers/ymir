"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toPythonEnv_1 = require("./toPythonEnv");
class WSGIWrapper {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.responseBucket = null;
        this.start_response = this.start_response.bind(this);
    }
    writeIter(iter) {
        for (const part of iter) {
            if (part) {
                this.write(part);
            }
        }
        this.res.end();
    }
    write(data) {
        if (!this.res.headersSent) {
            this._writeStatusAndHeaders();
        }
        this.res.write(data);
    }
    start_response(pythonStatus, pythonHeaders, execInfo) {
        pythonHeaders = pythonHeaders.valueOf();
        if (execInfo !== undefined) {
            if (this.res.headersSent) {
                throw new Error(execInfo[1]);
            }
        }
        else if (this.responseBucket) {
            throw new Error('Headers already set, start_response called twice');
        }
        const parts = pythonStatus.split(' ');
        const code = parseInt(parts[0], 10);
        const message = parts[1];
        const headers = {};
        for (const [headerName, headerValue] of pythonHeaders) {
            headers[headerName] = headerValue;
        }
        this.responseBucket = {
            code,
            headers,
            message,
        };
        return this.write;
    }
    get env() {
        return toPythonEnv_1.toPythonEnv(this.req);
    }
    _writeStatusAndHeaders() {
        if (!this.responseBucket) {
            throw new Error('write() was invoked before start_response()');
        }
        const { code, headers, message } = this.responseBucket;
        this.res.statusMessage = message;
        this.res.statusCode = code;
        this.res.set(headers);
    }
}
exports.WSGIWrapper = WSGIWrapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV1NHSS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9XU0dJLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsK0NBQTRDO0FBc0I1QztJQUdJLFlBQ29CLEdBQWMsRUFDZCxHQUFlO1FBRGYsUUFBRyxHQUFILEdBQUcsQ0FBVztRQUNkLFFBQUcsR0FBSCxHQUFHLENBQVk7UUFKNUIsbUJBQWMsR0FBK0IsSUFBSSxDQUFDO1FBUXJELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVNLFNBQVMsQ0FBQyxJQUFzQztRQUNuRCxLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksRUFBRTtZQUNyQixJQUFJLElBQUksRUFBRTtnQkFDTixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3BCO1NBQ0o7UUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFTSxLQUFLLENBQUMsSUFBcUI7UUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1NBQ2pDO1FBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVNLGNBQWMsQ0FDakIsWUFBb0IsRUFDcEIsYUFBaUMsRUFDakMsUUFBdUI7UUFHdkIsYUFBYSxHQUFHLGFBQWEsQ0FBQyxPQUFRLEVBQVMsQ0FBQztRQUVoRCxJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUU7WUFDeEIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRTtnQkFDdEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNoQztTQUNKO2FBQU0sSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0RBQWtELENBQUMsQ0FBQztTQUN2RTtRQUVELE1BQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEMsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNwQyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekIsTUFBTSxPQUFPLEdBQVUsRUFBRSxDQUFDO1FBRTFCLEtBQUssTUFBTSxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsSUFBSSxhQUFhLEVBQUU7WUFDbkQsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLFdBQVcsQ0FBQztTQUNyQztRQUVELElBQUksQ0FBQyxjQUFjLEdBQUc7WUFDbEIsSUFBSTtZQUNKLE9BQU87WUFDUCxPQUFPO1NBQ1YsQ0FBQztRQUVGLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBSSxHQUFHO1FBQ0gsT0FBTyx5QkFBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRU8sc0JBQXNCO1FBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsNkNBQTZDLENBQUMsQ0FBQztTQUNsRTtRQUVELE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDdkQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUMzQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQixDQUFDO0NBQ0o7QUE1RUQsa0NBNEVDIn0=