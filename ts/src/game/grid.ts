import { Engine, minMax } from "../engine/engine.js";
import { DrawObject, GameObject } from "../engine/gameObject.js";
import { Vector } from "../engine/vector.js";
import { Cell } from "./cell.js";

class Grid extends GameObject {
    cells: Cell[][] = [];
    borderSize: number = 5;
    static gridPos: Vector[] = [];

    constructor(position: Vector, gameObjects: GameObject[]) {
        super(position);

        let xThird = (Engine.playableArea.max.x - Engine.playableArea.min.x) / 3;
        let yThird = (Engine.playableArea.max.y - Engine.playableArea.min.y) / 3;

        let cellWidth = xThird - Engine.playableArea.min.x;
        let cellHeight = yThird - Engine.playableArea.min.y;

        console.log("min x: ", Engine.playableArea.min.x)
        console.log("xthird: ", xThird)

        console.log("Cell width: ", cellWidth)
        console.log("Cell height: ", cellHeight)

        Grid.gridPos.push(new Vector(
            Engine.playableArea.min.x + (((Engine.playableArea.min.x + xThird) - Engine.playableArea.min.x) / 2),
            Engine.playableArea.min.y + (((Engine.playableArea.min.y + yThird) - Engine.playableArea.min.y) / 2)
        ));

        for (let x = 0; x < 3; x++) {
            this.cells.push([]);

            for (let y = 0; y < 3; y++) {
                let minMax: minMax = {
                    min: new Vector(Grid.gridPos[Grid.gridPos.length - 1].x - (cellWidth / 2), Grid.gridPos[Grid.gridPos.length - 1].y - (cellHeight / 2)),
                    max: new Vector(Grid.gridPos[Grid.gridPos.length - 1].x + (cellWidth / 2), Grid.gridPos[Grid.gridPos.length - 1].y + (cellHeight / 2))
                }

                Grid.gridPos.push(new Vector(Grid.gridPos[0].x + (xThird * x), Grid.gridPos[0].y + (yThird * y)))
                let cell = new Cell(Grid.gridPos[Grid.gridPos.length - 1], minMax, gameObjects);

                gameObjects.push(cell)
                //this.cells[x].push(cell);
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
        for (let pos of Grid.gridPos)
            this.drawAPixel(pos);

        this.drawByLine();
    }
}

export { Grid }