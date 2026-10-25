import { TypeCheck } from "./validations/typecheck.js";
import { Canvas } from "./render/canvas.js"
import { Entity } from "./entity.js"
import { Draw } from "./render/draw.js";
import { EntitySimulate, SimulationFlags } from "./physics/entitySimulate.js"

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
const canvas1 = new Canvas({
    width: canvasWidth, 
    height: canvasHeight
});
const canvas2 = new Canvas({
    width: canvasWidth, 
    height: canvasHeight
});

let currentActiveCanvas = canvas1;
let alternateCanvas = canvas2;
function switchActiveCanvas() {
    currentActiveCanvas.removeCanvas();
    alternateCanvas.injectCanvas();

    [currentActiveCanvas, alternateCanvas] = [alternateCanvas, currentActiveCanvas];
}

function getRandomIntegerInclusive(min, max) {
    TypeCheck.isInteger(min);
    TypeCheck.isInteger(max);

    return Math.floor(Math.random() * (max - min + 1) + min);
}

const colors = ['red', 'blue', 'yellow', 'green'];
function getRandomColor() {
    return colors[getRandomIntegerInclusive(0, 3)];
}

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
        color: getRandomColor()
    });

    EntitySimulate.hook(entity);
    EntitySimulate.setSimulationFlags(entity, [SimulationFlags.CANVAS_COLLISION, SimulationFlags.BOUNCE]);

    currentActiveCanvas.addBoundedEntity(entity);
}

function step() {
    currentActiveCanvas.clear();

    Draw.renderEntities(currentActiveCanvas);

    requestAnimationFrame(step);
}

requestAnimationFrame(step);

EntitySimulate.startSimulation();

const debugRow = document.createElement('div');
debugRow.style.display = 'flex';
debugRow.style.flexDirection = 'row';
document.body.appendChild(debugRow);

const generateButton = document.createElement('button');
generateButton.textContent = 'Generate Entity';
generateButton.addEventListener('click', generateRandomEntity);
debugRow.appendChild(generateButton);

const switchCanvasButton = document.createElement('button');
switchCanvasButton.textContent = 'Switch Canvas';
switchCanvasButton.addEventListener('click', switchActiveCanvas);
debugRow.appendChild(switchCanvasButton);

canvas1.injectCanvas();