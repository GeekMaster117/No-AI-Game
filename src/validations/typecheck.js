export class TypeCheck {
    static isInteger(variable) {
        if (!Number.isInteger(variable)) {
            throw new TypeError(`Expected an Integer, received of type: ${typeof(variable)} value: ${variable}`);
        }
    }

    static isFloat(variable) {
        if (Number(variable) !== variable || variable % 1 === 0) {
            throw new TypeError(`Expected an Float, received of type: ${typeof(variable)} value: ${variable}`);
        }
    }

    static isString(variable) {
        if (typeof(variable) !== 'string') {
            throw new TypeError(`Expected a String, received of type: ${typeof(variable)} value: ${variable}`);
        }
    }

    static isBoolean(variable) {
        if (typeof(variable) !== 'boolean') {
            throw new TypeError(`Expected a Boolean, received of type: ${typeof(variable)} value: ${variable}`);
        }
    }

    static isValid(variable) {
        if (variable == null) {
            throw new TypeError(`Expected a valid value, received of type: ${typeof(variable)}`);
        }
    }

    static isNullOrUndefined(variable) {
        if (variable != null) {
            throw new TypeError(`Expected a valid value, received of type: ${typeof(variable)}`);
        }
    }

    static isObject(object) {
        if (!(typeof(object) === 'object')) {
            throw new TypeError(`Expected an object, received of type: ${typeof(object)}`)
        }
    }

    static isInstanceOf(object, className) {
        TypeCheck.isObject(object);

        if (!(object instanceof className)) {
            throw new TypeError(`Expected an object of ${className}, received: ${object.constructor.name}`)
        }
    }
    
    static isIterable(object) {
        TypeCheck.isObject(object);

        if(typeof(object[Symbol.iterator]) !== 'function') {
            throw new TypeError(`Expected an iterable object, received a non-iterable object: ${object.constructor.name}`)
        }
    }

    static isFunction(fn) {
        if(typeof(fn) !== 'function' ) {
            throw new TypeError(`Expected a function, received of type: ${typeof(fn)}`)
        }
    }
}