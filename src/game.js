import { Entity } from "./entity.js";

let player = new Entity('player', 20, 10, 8);
let enemy = new Entity('enemy', 15, 2, 6);

while (!player.isDead() && !enemy.isDead()) {
    player.attack(enemy);
    enemy.attack(player);
}