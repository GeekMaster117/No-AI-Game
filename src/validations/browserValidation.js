import { TypeCheck } from "./typecheck.js";

class CSSParseError extends Error {
    constructor(message = 'CSSParseError') {
        super(message);
        this.name = 'CSSParseError';
    }
}

export class BrowserValidation {
    static isValidCSSColor(color) {
        TypeCheck.isString(color);

        const option = new Option();
        option.style.color = color;

        if (option.style.color !== color) {
            throw new CSSParseError(`Invalid CSS Color: ${color}`);
        }
    }
}