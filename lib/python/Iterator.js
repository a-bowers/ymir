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
        if (PyException_1.PyException.is(e, 'StopIteration')) {
            return null;
        }
        throw e;
    }
}
exports.iterate = iterate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXRlcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcHl0aG9uL0l0ZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0NBQTRDO0FBTTVDLFFBQWUsQ0FBQyxTQUFxQixJQUFvQjtJQUNyRCxJQUFJO1FBQ0EsT0FBTyxJQUFJLEVBQUU7WUFDVCxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNyQjtLQUNKO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDUixJQUFJLHlCQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsRUFBRTtZQUNwQyxPQUFPLElBQUksQ0FBQztTQUNmO1FBQ0QsTUFBTSxDQUFDLENBQUM7S0FDWDtBQUNMLENBQUM7QUFYRCwwQkFXQyJ9