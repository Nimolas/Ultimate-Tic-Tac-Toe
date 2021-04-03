import { GameObject } from "../gameobjects/gameObject.js"

interface IGame {
    gameObjects: GameObject[];
    destructor(): void;
    checkDelete(): void;
    update(): void;
    draw(): void;
}

export { IGame }