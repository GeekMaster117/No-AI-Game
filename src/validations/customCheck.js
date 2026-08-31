import { TypeCheck } from "./typecheck";
import { RangeCheck } from "./rangeCheck";

export class CustomCheck {
    /**
     * Executes multiple checks with their respective arguments, to validate for one or multiple conditions.
     * 
     * @param {Array<[Function, Array<*>]>} tasks - An array of tasks, where each task is a [function, argumentsArray] tuple.
     */
    static any(tasks) {
        TypeCheck.isIterable(tasks);

        for (const task of tasks) {
            RangeCheck.isLength(task, 2);

            TypeCheck.isFunction(task[0]);
            TypeCheck.isIterable(task[1]);

            try {
                task[0](...task[1]);
                return;
            }
            catch {}
        }

        throw new Error(`All validations failed for ${tasks.map(([fn]) => fn)}`);
    }
}