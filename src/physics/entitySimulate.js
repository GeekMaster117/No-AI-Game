import { simulateTickRate } from "../configs/physicsConfigs";
import { TypeCheck } from "../validations/typecheck";
import { ReferenceCheck } from "../validations/referenceCheck";
import { Entity } from "../entity";

class EntitySimulate {
    #hookedEntities; #simulationStateStop;
    #simulateTimeout;

    #simulate() {
        this.#simulateTimeout = undefined;

        if (this.#simulationStateStop === true) {
            return;
        }

        if (this.#simulateTimeout == null) {
            this.#simulateTimeout = setTimeout(this.#simulate.bind(this), 1000 / simulateTickRate);
        }
    }

    constructor() {
        this.#hookedEntities = new Map();
        this.#simulationStateStop = true;
    }

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

    startSimulation() {
        this.#simulationStateStop = false;
        if (this.#simulateTimeout == null) {
            this.#simulate();
        }
    }

    stopSimulation() {
        this.#simulationStateStop = true;
        clearTimeout(this.#simulateTimeout);
        this.#simulateTimeout = undefined;
    }
}

export const SimulationFlags = {
    CANVAS_COLLISION: "CANVAS_COLLISION"
}

export default new EntitySimulate();