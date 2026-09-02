import { TypeCheck } from "./validations/typecheck.js";
import { RangeCheck } from "./validations/rangeCheck.js";
import { AccessControl } from "./validations/accessControl.js"
import { CustomCheck } from "./validations/customCheck.js";
import { Canvas } from "./render/canvas.js";

export class Entity {
    #name; #health; 
    #attack; #defense;
    #width; #height;
    #x; #y; #velocityX; #velocityY;
    #canvas;

    constructor(name = '', health = 1, attack = 1, defense = 1, width = 1, height = 1, x = 0, y = 0, velocityX = 0, velocityY = 0, canvas = undefined) {
        TypeCheck.isString(name);
        TypeCheck.isInteger(health);
        TypeCheck.isInteger(attack);
        TypeCheck.isInteger(defense);
        TypeCheck.isInteger(width);
        TypeCheck.isInteger(height);
        TypeCheck.isInteger(x);
        TypeCheck.isInteger(y);

        CustomCheck.any([
            [TypeCheck.isInteger, [velocityX]],
            [TypeCheck.isFloat, [velocityX]]
        ]);
        CustomCheck.any([
            [TypeCheck.isInteger, [velocityY]],
            [TypeCheck.isFloat, [velocityY]]
        ]);
        CustomCheck.any([
            [TypeCheck.isInstanceOf, [canvas, Canvas]],
            [TypeCheck.isNullOrUndefined, [canvas]]
        ]);

        RangeCheck.isGreaterThan(health, 0);
        RangeCheck.isGreaterThan(attack, 0);
        RangeCheck.isGreaterThan(defense, 0);
        RangeCheck.isGreaterThan(width, 0);
        RangeCheck.isGreaterThan(height, 0);

        this.#name = name;
        this.#health = health;
        this.#attack = attack;
        this.#defense = defense;
        this.#width = width;
        this.#height = height;
        this.#x = x;
        this.#y = y;
        this.#velocityX = velocityX;
        this.#velocityY = velocityY;
        this.#canvas = canvas;

        AccessControl.setAccess(this, 'To change position and velocity of Entity');
    }

    #die() {
        console.log(`${this.#name} died`);
    }

    #calculateDamage(entityObj) {
        TypeCheck.isInstanceOf(entityObj, Entity);

        return Math.floor(this.#attack / entityObj.#defense) + 2
    }

    getDimensions() {
        return [this.#width, this.#height];
    }

    getPosition() {
        return [this.#x, this.#y];
    }

    getVelocity() {
        return [this.#velocityX, this.#velocityY];
    }

    getBoundedCanvas() {
        TypeCheck.isValid(this.#canvas);

        return this.#canvas;
    }

    setDimensions(width, height) {
        TypeCheck.isInteger(width);
        TypeCheck.isInteger(height);

        RangeCheck.isGreaterThan(width, 0);
        RangeCheck.isGreaterThan(height, 0);

        this.#width = width;
        this.#height = height;
    }

    setPosition(x, y, credential) {
        TypeCheck.isInteger(x);
        TypeCheck.isInteger(y);

        AccessControl.authorize(this, credential);

        this.#x = x;
        this.#y = y;
    }

    setVelocity(velocityX, velocityY, credential) {
        CustomCheck.any([
            [TypeCheck.isInteger, [velocityX]],
            [TypeCheck.isFloat, [velocityX]]
        ]);
        CustomCheck.any([
            [TypeCheck.isInteger, [velocityY]],
            [TypeCheck.isFloat, [velocityY]]
        ]);

        AccessControl.authorize(this, credential);

        this.#velocityX = velocityX;
        this.#velocityY = velocityY;
    }

    setBoundedCanvas(canvas) {
        TypeCheck.isInstanceOf(canvas, Canvas);

        this.#canvas = canvas;
    }

    isDead() {
        return this.#health <= 0;
    }

    decreaseHealth(damage) {
        if (this.#health <= 0) {
            return;
        }

        TypeCheck.isInteger(damage);

        if (damage >= this.#health) {
            this.#health = 0;
            this.#die();
        }
        else {
            this.#health -= damage;
        }
    }

    attack(entityObj) {
        TypeCheck.isInstanceOf(entityObj, Entity);

        entityObj.decreaseHealth(this.#calculateDamage(entityObj));
    }
}

