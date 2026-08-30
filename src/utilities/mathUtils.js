import { TypeCheck } from "../validations/typecheck";

export function clamp(value, min, max) {
    TypeCheck.isInteger(value);
    TypeCheck.isInteger(min);
    TypeCheck.isInteger(max);

    return Math.min(Math.max(value, min), max);
}