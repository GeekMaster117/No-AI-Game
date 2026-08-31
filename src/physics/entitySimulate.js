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

        if (this.#simulationStateStop === true) {
            return;
        }

        if (this.#simulateTimeout == null) {
            this.#simulateTimeout = setTimeout(EntitySimulate.#simulate, 1000 / simulateTickRate);
        }
    }

    hook(entity) {
        TypeCheck.isInstanceOf(entity, Entity);

        if(!EntitySimulate.#hookedEntities.has(entity)) {
            EntitySimulate.#hookedEntities.set(entity, new Set());
        }
    }

    unhook(entity) {
        TypeCheck.isInstanceOf(entity, Entity);

        EntitySimulate.#hookedEntities.delete(entity);
    }

    setSimulationFlags(entity, simulationFlags) {
        TypeCheck.isInstanceOf(entity, Entity);
        TypeCheck.isIterable(simulationFlags);

        ReferenceCheck.mapHas(EntitySimulate.#hookedEntities, entity);

        const entitySimulationFlags = EntitySimulate.#hookedEntities.get(entity);
        simulationFlags.forEach(flag => entitySimulationFlags.add(flag));
    }

    startSimulation() {
        EntitySimulate.#simulationStateStop = false;
        if (EntitySimulate.#simulateTimeout == null) {
            EntitySimulate.#simulate();
        }
    }

    stopSimulation() {
        EntitySimulate.#simulationStateStop = true;
        clearTimeout(EntitySimulate.#simulateTimeout);
        EntitySimulate.#simulateTimeout = undefined;
    }
}

export const SimulationFlags = {
    CANVAS_COLLISION: "CANVAS_COLLISION"
}