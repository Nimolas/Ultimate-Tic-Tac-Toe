import { GameObject } from "../engine/gameObject";
import { IGame } from "../interfaces/iGame";

class TicTacToe implements IGame {
    gameObjects: GameObject[];
    destructor(): void {
        throw new Error("Method not implemented.");
    }
    checkDelete(): void {
        throw new Error("Method not implemented.");
    }
    update(): void {
        throw new Error("Method not implemented.");
    }
    draw(): void {
        throw new Error("Method not implemented.");
    }
}