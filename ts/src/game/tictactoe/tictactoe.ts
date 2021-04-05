import { Engine } from "../../engine/engine.js";
import { GameObject } from "../../engine//gameobjects/gameObject.js";
import { Vector } from "../../engine/utils/vector.js";
import { IGame } from "../../engine/interfaces/iGame.js";
import { Grid } from "./grid.js";

class TicTacToe implements IGame {
    gameObjects: GameObject[] = [];

    constructor(version: string) {
        if (version == "AI") {

        }

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