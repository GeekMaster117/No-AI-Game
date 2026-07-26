import { TypeCheck } from "./typecheck.js";

export class RangeCheck {
    static isGreaterThan(variable, threshold) {
        TypeCheck.isInteger(variable);
        TypeCheck.isInteger(threshold);

        if (variable <= threshold) {
            throw new RangeError(`${variable} must be greater than ${threshold}`);
        }
    }
}