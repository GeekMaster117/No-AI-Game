import { TypeCheck } from "./validations/typecheck.js";
import { RangeCheck } from "./validations/rangeCheck.js";

export class Entity {
    #name; #health; #attack; #defense;

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
    }

    #die() {
        console.log(`${this.#name} died`);
    }

    #calculateDamage(entityObj) {
        TypeCheck.isInstanceOf(entityObj, Entity);

        return Math.floor(this.#attack / entityObj.#defense) + 2
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

