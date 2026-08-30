import { TypeCheck } from "./typecheck";

export class ReferenceCheck {
    static mapHas(map, key) {
        TypeCheck.isInstanceOf(map, Map);
        TypeCheck.isObject(key);

        if(!map.has(key)) {
            throw new ReferenceError(`Key ${key.constructor.name} cannot be referenced in Map: ${map.constructor.name}`);
        }
    }
}