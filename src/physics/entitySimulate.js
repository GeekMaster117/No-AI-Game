import { simulateTickRate } from "../configs/physicsConfigs.js";
import { TypeCheck } from "../validations/typecheck.js";
import { ReferenceCheck } from "../validations/referenceCheck.js";
import { CustomCheck } from "../validations/customCheck.js";
import { Entity } from "../entity.js";
import { Canvas } from "../render/canvas.js";
import { clamp } from "../utilities/mathUtils.js";
import { AccessControl } from "../validations/accessControl.js";

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

        Canvas.getActiveCanvas().forEach(canvas => {
            canvas.getBoundedEntities().forEach(entity => {
                if (!EntitySimulate.#hookedEntities.has(entity)) {
                    return;
                }

                const flags = EntitySimulate.#hookedEntities.get(entity);

                let [x, y] = entity.getPosition();
                const [width, height] = entity.getDimensions();
                let [velocityX, velocityY] = entity.getVelocity();

                if (flags.has(SimulationFlags.CANVAS_COLLISION)) {
                    const [canvasWidth, canvasHeight] = canvas.getDimensions();

                    let horizontalSidesCollided = 0
                    if (x <= 0) {
                        ++horizontalSidesCollided;
                    }
                    if (x + width >= canvasWidth) {
                        ++horizontalSidesCollided;
                    }

                    let verticalSidesCollided = 0;
                    if (y <= 0) {
                        ++verticalSidesCollided;
                    }
                    if (y + height >= canvasHeight) {
                        ++verticalSidesCollided;
                    }

                    x = clamp(Math.round(x), 0, canvasWidth - width);
                    y = clamp(Math.round(y), 0, canvasHeight - height);

                    // if horizontalSidesCollided or VerticalSidesCollided is more then 1, it means the entity is boxed in and don't update the velocity
                    if (flags.has(SimulationFlags.BOUNCE)) {
                        if (horizontalSidesCollided == 1) {
                            velocityX *= -1;
                        }
                        if (verticalSidesCollided == 1) {
                            velocityY *= -1;
                        }

                        entity.setVelocity(velocityX, velocityY, AccessControl.getAccess(entity));
                    }
                }

                x = Math.round(x + (velocityX * elapsed));
                y = Math.round(y + (velocityY * elapsed));

                entity.setPosition(x, y, AccessControl.getAccess(entity));
            });
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