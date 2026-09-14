import { simulateTickRate } from "../configs/physicsConfigs";
import { TypeCheck } from "../validations/typecheck";
import { ReferenceCheck } from "../validations/referenceCheck";
import { CustomCheck } from "../validations/customCheck";
import { Entity } from "../entity";
import { clamp } from "../utilities/mathUtils";
import { AccessControl } from "../validations/accessControl";

export class EntitySimulate {
    static #hookedEntities = new Map();
    static #simulationStateStop = true;
    static #simulateTimeout;
    static #prevTimestamp;

    static #simulate() {
        EntitySimulate.#simulateTimeout = undefined;

        if (EntitySimulate.#simulationStateStop === true) {
            return;
        }

        if (EntitySimulate.#prevTimestamp == null) {
            EntitySimulate.#prevTimestamp = performance.now();
        }
        const currentTimestamp = performance.now();
        const elapsed = currentTimestamp - EntitySimulate.#prevTimestamp;
        EntitySimulate.#prevTimestamp = currentTimestamp;

        EntitySimulate.#hookedEntities.forEach((flags, entity) => {
            let [x, y] = entity.getPosition();
            const [width, height] = entity.getDimensions();
            const [velocityX, velocityY] = entity.getVelocity();

            if (flags.has(SimulationFlags.CANVAS_COLLISION)) {
                const [canvasWidth, canvasHeight] = entity.getBoundedCanvas().getDimensions();

                x = Math.round(clamp(x + (velocityX * elapsed), 0, canvasWidth - width));
                y = Math.round(clamp(y + (velocityY * elapsed), 0, canvasHeight - height));
            }
            else {
                x = Math.round(x + (velocityX * elapsed));
                y = Math.round(y + (velocityY * elapsed));
            }

            entity.setPosition(x, y, AccessControl.getAccess(entity));
        });

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

        CustomCheck.all([...simulationFlags].map(flag => [ReferenceCheck.objectHas, [SimulationFlags, flag]]));
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

        EntitySimulate.#prevTimestamp = null;
    }
}

export const SimulationFlags = {
    CANVAS_COLLISION: "CANVAS_COLLISION",
    BOUNCE: "BOUNCE"
}