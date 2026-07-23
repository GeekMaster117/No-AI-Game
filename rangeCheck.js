import { Typecheck } from "./typecheck.js";

export class RangeCheck {
    static isGreaterThan(variable, threshold) {
        Typecheck.isInteger(variable);
        Typecheck.isInteger(threshold);

        if (variable <= threshold) {
            throw new RangeError(`${variable} must be greater than ${threshold}`);
        }
    }
}