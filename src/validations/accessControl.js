import { TypeCheck } from "./typecheck";
import { ReferenceCheck } from "./referenceCheck"
import { CustomCheck } from "./customCheck";

class UnauthorizedError extends Error {
    constructor(message = 'Unauthorized') {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

export class AccessControl {
    static #accessMap = new Map();

    static setAccess(key, description = undefined) {
        ReferenceCheck.mapNotHas(AccessControl.#accessMap, key);
        CustomCheck.any([
            [TypeCheck.isString, [description]],
            [TypeCheck.isInteger, [description]],
            [TypeCheck.isNullOrUndefined, [description]]
        ]);

        const credential = Symbol(description);
        AccessControl.#accessMap.set(key, credential);
    }

    static getAccess(key) {
        ReferenceCheck.mapHas(AccessControl.#accessMap, key);

        return AccessControl.#accessMap.get(key);
    }

    static authorize(key, credential) {
        ReferenceCheck.mapHas(AccessControl.#accessMap, key);

        if (AccessControl.#accessMap.get(key) !== credential) {
            throw new UnauthorizedError(`Unauthorized attempt to access ${key.constructor.name}`)
        }
    }
}