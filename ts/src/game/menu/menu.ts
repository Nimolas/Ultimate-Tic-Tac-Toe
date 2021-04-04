import { Engine } from "../../engine/engine.js";
import { GameObject } from "../../engine/gameobjects/gameObject.js";
import { MinMax } from "../../engine/gameobjects/minMax.js";
import { Vector } from "../../engine/utils/vector.js";
import { IGame } from "../../engine/interfaces/iGame.js"
import { Button } from "./button.js";


class Menu implements IGame {
    gameObjects: GameObject[] = [];

    constructor() {
        let playableDist: Vector = new Vector(
            Engine.playableArea.max.x - Engine.playableArea.min.x,
            Engine.playableArea.max.y - Engine.playableArea.min.y
        )

        let dist: Vector = new Vector(
            playableDist.x / 2,
            playableDist.y / 2
        )

        this.gameObjects.push(new Button(
            new Vector(
                Engine.playableArea.min.x + (dist.x / 2),
                Engine.playableArea.min.y + ((dist.y / 2) + dist.y / 2)

            ),
            dist,
            "Local"))

        this.gameObjects.push(new Button(
            new Vector(
                Engine.playableArea.min.x + (dist.x + (dist.x / 2)),
                Engine.playableArea.min.y + ((dist.y / 2) + dist.y / 2)

            ),
            dist,
            "Online"))
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

export { Menu }