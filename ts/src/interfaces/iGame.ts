import { GameObject } from "../engine/gameObject";

interface IGame {
    gameObjects: GameObject[];
    destructor(): void;
    checkDelete(): void;
    update(): void;
    draw(): void;
}

export { IGame }