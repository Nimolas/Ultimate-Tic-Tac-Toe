import { Engine } from "../../engine/engine.js";
import { GameObject } from "../../engine/gameobjects/gameObject.js";
import { Vector } from "../../engine/utils/vector.js";
import { IGame } from "../../engine/interfaces/iGame.js"
import { Button } from "./button.js";
import { TicTacToe } from "../tictactoe/tictactoe.js";


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

        let localButton = this.gameObjects.last() as Button;
        localButton.handleMouseEvents = () => {
            for (let mouseEvent of Engine.mouseClickPositions)
                if (localButton.minMax.pointIntersects(localButton.toLocalCoords(mouseEvent)))
                    Engine.switchScene(new TicTacToe("AI"))
        }

        this.gameObjects.push(new Button(
            new Vector(
                Engine.playableArea.min.x + (dist.x + (dist.x / 2)),
                Engine.playableArea.min.y + ((dist.y / 2) + dist.y / 2)
            ),
            dist,
            "Online"))

        let onlineButton = this.gameObjects.last() as Button;
        onlineButton.handleMouseEvents = () => {
            for (let mouseEvent of Engine.mouseClickPositions)
                if (onlineButton.minMax.pointIntersects(onlineButton.toLocalCoords(mouseEvent)))
                    Engine.switchScene(new TicTacToe("Online"))
        }
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