import { Canvas } from "./render/canvas.js"
import { Entity } from "./entity.js"
import { EntitySimulate, SimulationFlags } from "./physics/entitySimulate.js"

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
let canvas = new Canvas(canvasWidth, canvasHeight);
canvas.injectCanvas();

let box = new Entity({
    x: 0,
    y: 50,
    width: 200,
    height: 200,
    velocityX: 0.6,
    velocityY: 0.6,
    canvas: canvas
});
EntitySimulate.hook(box);
EntitySimulate.setSimulationFlags(box, [SimulationFlags.CANVAS_COLLISION, SimulationFlags.BOUNCE]);

function step(timestamp) {
    canvas.clear();

    box.render();

    requestAnimationFrame(step);
}

requestAnimationFrame(step);

EntitySimulate.startSimulation();