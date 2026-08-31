import { TypeCheck } from "../validations/typecheck";
import { ReferenceCheck } from "../validations/referenceCheck"
import { CustomCheck } from "../validations/customCheck";

class AccessControl {
    #accessMap;

    constructor() {
        this.#accessMap = new Map();
    }

    setAccess(key, description = undefined) {
        ReferenceCheck.mapNotHas(this.#accessMap, key);
        CustomCheck.any([
            [TypeCheck.isString, [description]],
            [TypeCheck.isInteger, [description]],
            [TypeCheck.isNullOrUndefined, [description]]
        ]);

        const credential = Symbol(description);
        this.#accessMap.set(key, credential);
    }

    getAccess(key) {
        ReferenceCheck.mapHas(this.#accessMap, key);

        return this.#accessMap.get(key);
    }
}

export default new AccessControl();