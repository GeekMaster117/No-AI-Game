import { simulateTickRate } from "../configs/physicsConfigs";
import { TypeCheck } from "../validations/typecheck";
import { ReferenceCheck } from "../validations/referenceCheck";
import { Entity } from "../entity";

class EntitySimulate {
    #hookedEntities = new Map();

    hook(entity) {
        TypeCheck.isInstanceOf(entity, Entity);

        if(!this.#hookedEntities.has(entity)) {
            this.#hookedEntities.set(entity, new Set());
        }
    }

    unhook(entity) {
        TypeCheck.isInstanceOf(entity, Entity);

        this.#hookedEntities.delete(entity);
    }

    setSimulationFlags(entity, simulationFlags) {
        TypeCheck.isInstanceOf(entity, Entity);
        TypeCheck.isIterable(simulationFlags);

        ReferenceCheck.mapHas(this.#hookedEntities, entity);

        const entitySimulationFlags = this.#hookedEntities.get(entity);
        simulationFlags.forEach(flag => entitySimulationFlags.add(flag));
    }
}

export const SimulationFlags = {
    CANVAS_COLLISION: "CANVAS_COLLISION"
}

export default new EntitySimulate();