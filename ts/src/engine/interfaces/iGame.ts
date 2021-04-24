import { GameObject } from "../gameobjects/gameObject.js"

class IGame {
    gameObjects: GameObject[] = [];

    destructor(): void {
        for (let gameObject of this.gameObjects)
            gameObject.destructor();
    }

    checkDelete(): void {
        for (let gameObject of this.gameObjects)
            if (gameObject.checkDelete(this.gameObjects))
                this.gameObjects[this.gameObjects.indexOf(gameObject)] = undefined;
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

export { IGame }