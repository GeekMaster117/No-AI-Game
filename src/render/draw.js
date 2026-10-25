import { AccessControl } from "../validations/accessControl.js";
import { TypeCheck } from "../validations/typecheck.js";
import { RangeCheck } from "../validations/rangeCheck.js";
import { Canvas } from "./canvas.js";

export class Draw {
    static #drawSquare(context, x, y, width, height, color) {
        TypeCheck.isInstanceOf(context, CanvasRenderingContext2D);

        TypeCheck.isInteger(x);
        TypeCheck.isInteger(y);
        TypeCheck.isInteger(width);
        TypeCheck.isInteger(height);
        TypeCheck.isString(color);

        RangeCheck.isGreaterThan(width, 0);
        RangeCheck.isGreaterThan(height, 0);

        context.fillStyle = color;
        context.fillRect(x, y, width, height);
    }

    static renderEntities(canvas) {
        TypeCheck.isInstanceOf(canvas, Canvas);

        const context = canvas.getCanvasContext(AccessControl.getAccess(canvas));
        console.log(context);

        canvas.getBoundedEntities().forEach(entity => {
            const [x, y] = entity.getPosition();
            const [width, height] = entity.getDimensions();
            const color = entity.getColor();

            Draw.#drawSquare(context, x, y, width, height, color);
        });
    }
}