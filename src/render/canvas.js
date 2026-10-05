import { TypeCheck } from "../validations/typecheck.js";
import { RangeCheck } from "../validations/rangeCheck.js";

export class Canvas {
    #element; #width; #height; #context;

    constructor(width, height) {
        TypeCheck.isInteger(width);
        TypeCheck.isInteger(height);

        RangeCheck.isGreaterThan(width, 0);
        RangeCheck.isGreaterThan(height, 0);

        this.#element = document.createElement('canvas');
        this.#element.width = width;
        this.#element.height = height;
        this.#width = width;
        this.#height = height;
        this.#context = this.#element.getContext('2d');
    }

    getDimensions() {
        return [this.#width, this.#height];
    }

    drawSquare(x, y, width, height, color) {
        TypeCheck.isInteger(x);
        TypeCheck.isInteger(y);
        TypeCheck.isInteger(width);
        TypeCheck.isInteger(height);
        TypeCheck.isString(color);

        RangeCheck.isGreaterThan(width, 0);
        RangeCheck.isGreaterThan(height, 0);

        this.#context.fillStyle = color;
        this.#context.fillRect(x, y, width, height);
    }

    clear() {
        this.#context.clearRect(0, 0, this.#width, this.#height);
    }

    injectCanvas() {
        document.body.appendChild(this.#element);
    }
}