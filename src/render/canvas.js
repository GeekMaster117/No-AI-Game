import { TypeCheck } from "../validations/typecheck.js";
import { RangeCheck } from "../validations/rangeCheck.js";
import { CustomCheck } from "../validations/customCheck.js";
import { AccessControl } from "../validations/accessControl.js";
import { Entity } from "../entity.js"

export class Canvas {
    static #activeCanvas = new Set();

    #element; #width; #height; #context;
    #boundedEntities;

    constructor({width, height, entities = new Set()}) {
        TypeCheck.isInteger(width);
        TypeCheck.isInteger(height);

        RangeCheck.isGreaterThan(width, 0);
        RangeCheck.isGreaterThan(height, 0);

        TypeCheck.isIterable(entities);
        CustomCheck.all([...entities].map(entity => [TypeCheck.isInstanceOf, [entity, Entity]]));

        this.#element = document.createElement('canvas');
        this.#element.width = width;
        this.#element.height = height;
        this.#width = width;
        this.#height = height;
        this.#context = this.#element.getContext('2d');

        AccessControl.setAccess(this, "To draw on canvas using context");

        this.#boundedEntities = new Set(entities);
    }

    static getActiveCanvas() {
        return Canvas.#activeCanvas;
    }

    getCanvasContext(credential) {
        AccessControl.authorize(this, credential);

        return this.#context;
    }

    addBoundedEntity(entity) {
        TypeCheck.isInstanceOf(entity, Entity);

        this.#boundedEntities.add(entity);
    }

    removeBoundedEntity(entity) {
        TypeCheck.isInstanceOf(entity, Entity);

        this.#boundedEntities.delete(entity);
    }

    getBoundedEntities() {
        return this.#boundedEntities;
    }

    getDimensions() {
        return [this.#width, this.#height];
    }

    clear() {
        this.#context.clearRect(0, 0, this.#width, this.#height);
    }

    injectCanvas() {
        document.body.appendChild(this.#element);

        Canvas.#activeCanvas.add(this);
    }

    removeCanvas() {
        this.#element.remove();

        Canvas.#activeCanvas.delete(this);
    }

    isActive() {
        return Canvas.#activeCanvas.has(this);
    }
}