import { Engine } from "../../engine/engine.js";
import { GameObject } from "../../engine//gameobjects/gameObject.js";
import { Vector } from "../../engine/utils/vector.js";
import { IGame } from "../../engine/interfaces/iGame.js";
import { Grid } from "./grid.js";
import { AI } from "./ai.js";

class TicTacToe implements IGame {
    gameObjects: GameObject[] = [];
    ai: AI;

    constructor(version: string) {

        if (version == "AI") {
            this.ai = new AI("Naught");
        }

        this.gameObjects.push(new Grid(false, new Vector(Engine.playableArea.max.x / 2, Engine.playableArea.max.y / 2), this.gameObjects))
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