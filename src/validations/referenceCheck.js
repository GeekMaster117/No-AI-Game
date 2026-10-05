import { TypeCheck } from "./typecheck.js";

export class ReferenceCheck {
    static mapHas(map, key) {
        TypeCheck.isInstanceOf(map, Map);

        if(!map.has(key)) {
            throw new ReferenceError(`Key ${key != null && typeof(key) === 'object' ? key.constructor.name : key} cannot be referenced in Map: ${map.constructor.name}`);
        }
    }

    static mapNotHas(map, key) {
        TypeCheck.isInstanceOf(map, Map);

        if(map.has(key)) {
            throw new ReferenceError(`Key ${key != null && typeof(key) === 'object' ? key.constructor.name : key} can be referenced in Map: ${map.constructor.name}, when expecting not to`);
        }
    }

    static objectHas(object, key) {
        TypeCheck.isObject(object);

        if(!object.hasOwnProperty(key)) {
            throw new ReferenceError(`Key ${key != null && typeof(key) === 'object' ? key.constructor.name : key} cannot be referenced in Object: ${object.constructor.name}`);
        }
    }
}