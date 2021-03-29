import { Engine } from "../engine/engine.js";
import { GameObject } from "../engine/gameObject.js";
import { Vector } from "../engine/vector.js";
import { IGame } from "../interfaces/iGame.js";
import { Grid } from "./grid.js";

class TicTacToe implements IGame {
    gameObjects: GameObject[] = [];

    constructor() {
        this.gameObjects.push(new Grid(new Vector(Engine.playableArea.max.x / 2, Engine.playableArea.max.y / 2), this.gameObjects))
    }

    destructor(): void {
        for (let gameObject of this.gameObjects)
            gameObject.destructor();
    }

    checkDelete(): void {
        for (let gameObject of this.gameObjects)
            gameObject.checkDelete(this.gameObjects);
    }

    update(): void {
        for (let gameObject of this.gameObjects)
            gameObject.update(this.gameObjects);

        this.checkDelete();
    }

    draw(): void {
        for (let gameObject of this.gameObjects)
            gameObject.draw();
    }

}

export { TicTacToe }