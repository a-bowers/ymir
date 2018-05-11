"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PyException_1 = require("./PyException");
function* iterate(iter) {
    try {
        while (true) {
            yield iter.next();
        }
    }
    catch (e) {
        const err = PyException_1.PyException.Intercept(e);
        if (err instanceof PyException_1.PyException) {
            if (err.name === 'StopIteration') {
                return null;
            }
        }
        throw err;
    }
}
exports.iterate = iterate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXRlcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcHl0aG9uL0l0ZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0NBQTRDO0FBTTVDLFFBQWUsQ0FBQyxTQUFxQixJQUFvQjtJQUNyRCxJQUFJO1FBQ0EsT0FBTyxJQUFJLEVBQUU7WUFDVCxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNyQjtLQUNKO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFFUixNQUFNLEdBQUcsR0FBRyx5QkFBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxJQUFJLEdBQUcsWUFBWSx5QkFBVyxFQUFFO1lBQzVCLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxlQUFlLEVBQUU7Z0JBQzlCLE9BQU8sSUFBSSxDQUFDO2FBQ2Y7U0FDSjtRQUNELE1BQU0sR0FBRyxDQUFDO0tBQ2I7QUFDTCxDQUFDO0FBZkQsMEJBZUMifQ==