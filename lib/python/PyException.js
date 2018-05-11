"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PyException extends Error {
    constructor(err) {
        super(err.message);
        this.name = err.pyErrorName;
    }
    static is(err, errName) {
        return err.pyErrorName === errName;
    }
    static convert(err) {
        if (err.pyErrorName) {
            return new PyException(err);
        }
        return err;
    }
}
PyException.map = {};
exports.PyException = PyException;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHlFeGNlcHRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcHl0aG9uL1B5RXhjZXB0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsaUJBQXlCLFNBQVEsS0FBSztJQWVsQyxZQUFZLEdBQWE7UUFDckIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFJLEdBQVcsQ0FBQyxXQUFXLENBQUM7SUFDekMsQ0FBQztJQWZNLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBcUIsRUFBRSxPQUFlO1FBQ25ELE9BQVEsR0FBZ0IsQ0FBQyxXQUFXLEtBQUssT0FBTyxDQUFDO0lBQ3JELENBQUM7SUFFTSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQXFCO1FBQ3ZDLElBQUssR0FBZ0IsQ0FBQyxXQUFXLEVBQUU7WUFDL0IsT0FBTyxJQUFJLFdBQVcsQ0FBQyxHQUFlLENBQUMsQ0FBQztTQUMzQztRQUNELE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQzs7QUFYYSxlQUFHLEdBQUcsRUFBRSxDQUFDO0FBRDNCLGtDQW1CQyJ9