import { Canvas } from "./render/canvas.js"
import { Entity } from "./entity.js";

let canvas = new Canvas(window.innerWidth, window.innerHeight);
canvas.drawSquare(50, 50, 200, 200, 'red');
canvas.injectCanvas();

let player = new Entity('player', 20, 10, 8);
let enemy = new Entity('enemy', 15, 2, 6);

while (!player.isDead() && !enemy.isDead()) {
    player.attack(enemy);
    enemy.attack(player);
}