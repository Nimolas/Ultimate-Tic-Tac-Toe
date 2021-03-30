import { Engine, minMax } from "../engine/engine.js";
import { DrawObject, GameObject } from "../engine/gameObject.js";
import { Vector } from "../engine/vector.js";
import { Cell } from "./cell.js";

class Grid extends GameObject {
    cells: Cell[][] = [];
    borderSize: number = 5;


    constructor(position: Vector, gameObjects: GameObject[]) {
        super(position);

        let xThird = (Engine.playableArea.max.x - Engine.playableArea.min.x) / 3;
        let yThird = (Engine.playableArea.max.y - Engine.playableArea.min.y) / 3;

        for (let x = 0; x < 3; x++) {
            this.cells.push([]);

            for (let y = 0; y < 3; y++) {
                let cellPos = new Vector(
                    Engine.playableArea.min.x + ((xThird * (x + 1)) / 2),
                    Engine.playableArea.min.y + ((yThird * (y + 1)) / 2)
                )

                let minMax: minMax = {
                    min: new Vector(Engine.playableArea.min.x + (xThird * x), Engine.playableArea.min.y + (yThird * y)),
                    max: new Vector(Engine.playableArea.min.x + (xThird * (x + 1)), Engine.playableArea.min.y + (yThird * (y + 1)))
                }

                let cell = new Cell(cellPos, minMax, gameObjects)
                gameObjects.push(cell);
                this.cells[x].push(cell);
            }
        }

        this.setDrawObject(this.generateDrawObject(xThird, yThird))
    }

    generateDrawObject(xThird: number, yThird: number): DrawObject[] {

        let xFirstBarPos = (Engine.playableArea.min.x + xThird) - this.position.x;
        let xSecondBarPos = (Engine.playableArea.max.x - xThird) - this.position.x;

        let yFirstBarPos = (Engine.playableArea.min.y + yThird) - this.position.y;
        let ySecondBarPos = (Engine.playableArea.max.y - yThird) - this.position.y;

        let drawObjects: DrawObject[] = [];
        drawObjects.push({
            drawPoints: [
                new Vector(xFirstBarPos - this.borderSize, Engine.playableArea.min.y - this.position.y),
                new Vector(xFirstBarPos + this.borderSize, Engine.playableArea.min.y - this.position.y),
                new Vector(xFirstBarPos + this.borderSize, Engine.playableArea.max.y - this.position.y),
                new Vector(xFirstBarPos - this.borderSize, Engine.playableArea.max.y - this.position.y),
            ],
            fillColour: "#eaeaea",
        })
        drawObjects.push({
            drawPoints: [
                new Vector(xSecondBarPos - this.borderSize, Engine.playableArea.min.y - this.position.y),
                new Vector(xSecondBarPos + this.borderSize, Engine.playableArea.min.y - this.position.y),
                new Vector(xSecondBarPos + this.borderSize, Engine.playableArea.max.y - this.position.y),
                new Vector(xSecondBarPos - this.borderSize, Engine.playableArea.max.y - this.position.y),
            ],
            fillColour: "#eaeaea",
        })
        drawObjects.push({
            drawPoints: [
                new Vector(Engine.playableArea.min.x - this.position.x, yFirstBarPos - this.borderSize),
                new Vector(Engine.playableArea.max.x - this.position.x, yFirstBarPos - this.borderSize),
                new Vector(Engine.playableArea.max.x - this.position.x, yFirstBarPos + this.borderSize),
                new Vector(Engine.playableArea.min.x - this.position.x, yFirstBarPos + this.borderSize),
            ],
            fillColour: "#eaeaea",
        })
        drawObjects.push({
            drawPoints: [
                new Vector(Engine.playableArea.min.x - this.position.x, ySecondBarPos - this.borderSize),
                new Vector(Engine.playableArea.max.x - this.position.x, ySecondBarPos - this.borderSize),
                new Vector(Engine.playableArea.max.x - this.position.x, ySecondBarPos + this.borderSize),
                new Vector(Engine.playableArea.min.x - this.position.x, ySecondBarPos + this.borderSize),
            ],
            fillColour: "#eaeaea",
        })

        return drawObjects;
    }

    draw() {
        this.drawByLine();
    }
}

export { Grid }