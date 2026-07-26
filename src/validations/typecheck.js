export class TypeCheck {
    static isInteger(variable) {
        if (!Number.isInteger(variable)) {
            throw new TypeError(`Expected an Integer, received of type: ${typeof(variable)} value: ${variable}`);
        }
    }

    static isString(variable) {
        if (typeof(variable) !== 'string') {
            throw new TypeError(`Expected a String, received of type: ${typeof(variable)} value: ${variable}`);
        }
    }

    static isInstanceOf(object, className) {
        if (!(object instanceof className)) {
            throw new TypeError(`Expected an object of ${className}, received: ${typeof(object) === "object" ? object.constructor.name : typeof(object)}`)
        }
    }
}