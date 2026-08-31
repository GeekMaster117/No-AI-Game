import { simulateTickRate } from "../configs/physicsConfigs";
import { TypeCheck } from "../validations/typecheck";
import { ReferenceCheck } from "../validations/referenceCheck";
import { Entity } from "../entity";

export class EntitySimulate {
    static #hookedEntities = new Map();
    static #simulationStateStop = true;
    static #simulateTimeout;

    static #simulate() {
        EntitySimulate.#simulateTimeout = undefined;

        if (EntitySimulate.#simulationStateStop === true) {
            return;
        }

        if (EntitySimulate.#simulateTimeout == null) {
            EntitySimulate.#simulateTimeout = setTimeout(EntitySimulate.#simulate, 1000 / simulateTickRate);
        }
    }

    static hook(entity) {
        TypeCheck.isInstanceOf(entity, Entity);

        if(!EntitySimulate.#hookedEntities.has(entity)) {
            EntitySimulate.#hookedEntities.set(entity, new Set());
        }
    }

    static unhook(entity) {
        TypeCheck.isInstanceOf(entity, Entity);

        EntitySimulate.#hookedEntities.delete(entity);
    }

    static setSimulationFlags(entity, simulationFlags) {
        TypeCheck.isInstanceOf(entity, Entity);
        TypeCheck.isIterable(simulationFlags);

        ReferenceCheck.mapHas(EntitySimulate.#hookedEntities, entity);

        const entitySimulationFlags = EntitySimulate.#hookedEntities.get(entity);
        simulationFlags.forEach(flag => entitySimulationFlags.add(flag));
    }

    static startSimulation() {
        EntitySimulate.#simulationStateStop = false;
        if (EntitySimulate.#simulateTimeout == null) {
            EntitySimulate.#simulate();
        }
    }

    static stopSimulation() {
        EntitySimulate.#simulationStateStop = true;
        clearTimeout(EntitySimulate.#simulateTimeout);
        EntitySimulate.#simulateTimeout = undefined;
    }
}

export const SimulationFlags = {
    CANVAS_COLLISION: "CANVAS_COLLISION"
}