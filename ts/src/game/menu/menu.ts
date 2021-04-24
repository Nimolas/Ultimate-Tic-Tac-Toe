import { Engine } from "../../engine/engine.js";
import { GameObject } from "../../engine/gameobjects/gameObject.js";
import { Vector } from "../../engine/utils/vector.js";
import { IGame } from "../../engine/interfaces/iGame.js"
import { Button } from "../../engine/ui/button.js";
import "../../engine/utils/extensions.js"
import { TicTacToe } from "../tictactoe/tictactoe.js";


class Menu extends IGame {
    gameObjects: GameObject[] = [];

    constructor() {
        super();

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
            "Local",
            "#6D0AD0",
            "#ffffff"))

        let localButton = this.gameObjects.last() as Button;
        localButton.addMouseEvent(() => {
            Engine.switchScene(new TicTacToe("AI"))
        })

        this.gameObjects.push(new Button(
            new Vector(
                Engine.playableArea.min.x + (dist.x + (dist.x / 2)),
                Engine.playableArea.min.y + ((dist.y / 2) + dist.y / 2)

            ),
            dist,
            "Online",
            "#6D0AD0",
            "#ffffff"))

        let onlineButton = this.gameObjects.last() as Button;
        onlineButton.addMouseEvent(() => {
            this.gameObjects.push(new Button(
                new Vector(
                    Engine.playableArea.min.x + (dist.x / 2),
                    Engine.playableArea.min.y + ((dist.y / 2) + dist.y / 2)

                ),
                dist,
                "Host",
                "#6D0AD0",
                "#ffffff"))

            let hostButton = this.gameObjects.last() as Button;
            hostButton.addMouseEvent(() => {
                Engine.switchScene(new TicTacToe("Network:Host"))
            })

            this.gameObjects.push(new Button(
                new Vector(
                    Engine.playableArea.min.x + (dist.x + (dist.x / 2)),
                    Engine.playableArea.min.y + ((dist.y / 2) + dist.y / 2)

                ),
                dist,
                "Join",
                "#6D0AD0",
                "#ffffff"))

            let joinButton = this.gameObjects.last() as Button;
            joinButton.addMouseEvent(() => {
                Engine.switchScene(new TicTacToe("Network:Join"))
            })

            localButton.toDelete = true;
            onlineButton.toDelete = true;
        })
    }
}

export { Menu }