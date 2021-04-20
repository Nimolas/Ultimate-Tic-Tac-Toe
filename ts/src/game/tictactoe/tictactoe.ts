import { Engine } from "../../engine/engine.js";
import { GameObject } from "../../engine//gameobjects/gameObject.js";
import { Vector } from "../../engine/utils/vector.js";
import { IGame } from "../../engine/interfaces/iGame.js";
import { Grid } from "./grid.js";
import { AI } from "./ai.js";

class TicTacToe implements IGame {
    gameObjects: GameObject[] = [];
    ai: AI;
    aiActive: boolean = false;

    constructor(version: string) {

        if (version == "AI") {
            this.ai = new AI("Naught");
        }

        this.gameObjects.push(new Grid(new Vector(Engine.playableArea.max.x / 2, Engine.playableArea.max.y / 2), this.gameObjects))

        Engine.startCoRoutine(this.ai.start(this.gameObjects.last() as Grid, this))
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
        if (!this.aiActive) {
            for (let gameObject of this.gameObjects) {
                if (gameObject instanceof Grid)
                    this.aiActive = gameObject.update(this.aiActive);
                gameObject.update(this.gameObjects);
            }
        } else {
            this.ai.update()
        }

        this.checkDelete();
    }

    draw(): void {
        for (let gameObject of this.gameObjects)
            gameObject.draw();
    }
}

export { TicTacToe }