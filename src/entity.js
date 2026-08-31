import { TypeCheck } from "./validations/typecheck.js";
import { RangeCheck } from "./validations/rangeCheck.js";
import { AccessControl } from "./validations/accessControl.js"
import { CustomCheck } from "./validations/customCheck.js";

export class Entity {
    #name; #health; #attack; #defense;

    #x; #y; #velocityX; #velocityY;

    constructor(name, health, attack, defense) {
        TypeCheck.isString(name);
        TypeCheck.isInteger(health);
        TypeCheck.isInteger(attack);
        TypeCheck.isInteger(defense);

        RangeCheck.isGreaterThan(health, 0);
        RangeCheck.isGreaterThan(attack, 0);
        RangeCheck.isGreaterThan(defense, 0);

        this.#name = name;
        this.#health = health;
        this.#attack = attack;
        this.#defense = defense;

        AccessControl.setAccess(this, 'To change position and velocity of Entity');
    }

    #die() {
        console.log(`${this.#name} died`);
    }

    #calculateDamage(entityObj) {
        TypeCheck.isInstanceOf(entityObj, Entity);

        return Math.floor(this.#attack / entityObj.#defense) + 2
    }

    getPosition() {
        return [this.#x, this.#y];
    }

    getVelocity() {
        return [this.#velocityX, this.#velocityY];
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

