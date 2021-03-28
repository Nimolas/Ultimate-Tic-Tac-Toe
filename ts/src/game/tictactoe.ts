import { GameObject } from "../engine/gameObject.js";
import { IGame } from "../interfaces/iGame.js";

class TicTacToe implements IGame {
    gameObjects: GameObject[] = [];
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