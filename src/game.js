import { Canvas } from "./render/canvas.js"
import { clamp } from "./utilities/mathUtils.js";

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
let canvas = new Canvas(canvasWidth, canvasHeight);
canvas.injectCanvas();

let squareX = 0;
let squareSide = 200;
let velocityX = 0.6;

let prev;
function step(timestamp) {
    if (prev == null) {
        prev = timestamp;
    }
    const elapsed = timestamp - prev;
    prev = timestamp;

    squareX = clamp(Math.round(squareX + (velocityX * elapsed)), 0, canvasWidth - squareSide);
    if (squareX >= canvasWidth - squareSide) {
        velocityX = -Math.abs(velocityX);
    }
    else if (squareX <= 0) {
        velocityX = Math.abs(velocityX);
    }

    canvas.clear();
    canvas.drawSquare(squareX, 50, squareSide, squareSide, 'red');

    requestAnimationFrame(step);
}

requestAnimationFrame(step);