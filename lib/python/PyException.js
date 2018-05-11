"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PyException extends Error {
    constructor(err) {
        super(err.message);
        this.name = err.pyErrorName;
    }
    static Intercept(err) {
        if (err.pyErrorName) {
            return new PyException(err);
        }
        return err;
    }
}
PyException.map = {};
exports.PyException = PyException;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHlFeGNlcHRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcHl0aG9uL1B5RXhjZXB0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsaUJBQXlCLFNBQVEsS0FBSztJQVdsQyxZQUFZLEdBQWE7UUFDckIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFJLEdBQVcsQ0FBQyxXQUFXLENBQUM7SUFDekMsQ0FBQztJQVhNLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBcUI7UUFDekMsSUFBSyxHQUFnQixDQUFDLFdBQVcsRUFBRTtZQUMvQixPQUFPLElBQUksV0FBVyxDQUFDLEdBQWUsQ0FBQyxDQUFDO1NBQzNDO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDOztBQVBhLGVBQUcsR0FBRyxFQUFFLENBQUM7QUFEM0Isa0NBZUMifQ==