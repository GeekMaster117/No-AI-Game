import { Canvas } from "./render/canvas.js"
import { Entity } from "./entity.js"
import { EntitySimulate, SimulationFlags } from "./physics/entitySimulate.js"
import { TypeCheck } from "./validations/typecheck.js";

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
let canvas = new Canvas(canvasWidth, canvasHeight);

function getRandomIntegerInclusive(min, max) {
    TypeCheck.isInteger(min);
    TypeCheck.isInteger(max);

    return Math.floor(Math.random() * (max - min + 1) + min);
}

const colors = ['red', 'blue', 'yellow', 'green'];
function getRandomColor() {
    return colors[getRandomIntegerInclusive(0, 3)];
}

let entities = []
function generateRandomEntity() {
    const width = getRandomIntegerInclusive(10, 200);
    const height = getRandomIntegerInclusive(10, 200);
    const entity = new Entity({
        x: getRandomIntegerInclusive(0, canvasWidth - width),
        y: getRandomIntegerInclusive(0, canvasHeight - height),
        width: width,
        height: height,
        velocityX: Math.random(),
        velocityY: Math.random(),
        color: getRandomColor(),
        canvas: canvas
    });

    EntitySimulate.hook(entity);
    EntitySimulate.setSimulationFlags(entity, [SimulationFlags.CANVAS_COLLISION, SimulationFlags.BOUNCE]);

    entities.push(entity);
}

function step() {
    canvas.clear();

    entities.forEach(entity => entity.render());

    requestAnimationFrame(step);
}

requestAnimationFrame(step);

EntitySimulate.startSimulation();

const generateButton = document.createElement('button');
generateButton.textContent = 'Generate Entity';

generateButton.addEventListener('click', generateRandomEntity);

document.body.appendChild(generateButton);

canvas.injectCanvas();