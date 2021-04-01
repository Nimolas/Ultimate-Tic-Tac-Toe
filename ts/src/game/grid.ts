import { Engine } from "../engine/engine.js";
import { DrawObject, GameObject } from "../engine/gameObject.js";
import { MinMax } from "../engine/minMax.js";
import { Vector } from "../engine/vector.js";
import { Cell } from "./cell.js";

class Grid extends GameObject {
    cells: Cell[][] = [];
    borderSize: number = 2;
    currentActivePlayer: string = "Cross";

    constructor(position: Vector, gameObjects: GameObject[]) {
        super(position);

        let xThird: number = (Engine.playableArea.max.x - Engine.playableArea.min.x) / 3;
        let yThird: number = (Engine.playableArea.max.y - Engine.playableArea.min.y) / 3;

        let minX: number = Engine.playableArea.min.x
        let minY: number = Engine.playableArea.min.y

        for (let x = 0; x < 3; x++) {
            this.cells.push([]);
            if (x > 0)
                minX = minX + xThird;
            else minX = Engine.playableArea.min.x

            let maxX: number = minX + xThird

            for (let y = 0; y < 3; y++) {
                if (y > 0)
                    minY = minY + yThird
                else minY = Engine.playableArea.min.y

                let maxY: number = minY + yThird

                let cellPos = new Vector(
                    (minX + maxX) / 2,
                    (minY + maxY) / 2
                )

                let boundary: MinMax = new MinMax(new Vector(minX, minY), new Vector(maxX, maxY))

                let cell: Cell = new Cell(cellPos, boundary, gameObjects)
                gameObjects.push(cell);
                this.cells[x].push(cell);
            }
        }

        this.setDrawObject(this.generateDrawObject(xThird, yThird))
    }

    generateDrawObject(xThird: number, yThird: number): DrawObject[] {

        let firstBarPos: Vector = this.toLocalCoords(new Vector(
            Engine.playableArea.min.x + xThird,
            Engine.playableArea.min.y + yThird
        ));

        let secondBarPos: Vector = this.toLocalCoords(new Vector(
            Engine.playableArea.max.x - xThird,
            Engine.playableArea.max.y - yThird
        ));

        let drawObjects: DrawObject[] = [];
        drawObjects.push({
            drawPoints: [
                new Vector(firstBarPos.x - this.borderSize, Engine.playableArea.min.y - this.position.y),
                new Vector(firstBarPos.x + this.borderSize, Engine.playableArea.min.y - this.position.y),
                new Vector(firstBarPos.x + this.borderSize, Engine.playableArea.max.y - this.position.y),
                new Vector(firstBarPos.x - this.borderSize, Engine.playableArea.max.y - this.position.y),
            ],
            fillColour: "#6D0AD0",
            strokeColour: "#eaeaea",
        })
        drawObjects.push({
            drawPoints: [
                new Vector(secondBarPos.x - this.borderSize, Engine.playableArea.min.y - this.position.y),
                new Vector(secondBarPos.x + this.borderSize, Engine.playableArea.min.y - this.position.y),
                new Vector(secondBarPos.x + this.borderSize, Engine.playableArea.max.y - this.position.y),
                new Vector(secondBarPos.x - this.borderSize, Engine.playableArea.max.y - this.position.y),
            ],
            fillColour: "#6D0AD0",
            strokeColour: "#eaeaea",
        })
        drawObjects.push({
            drawPoints: [
                new Vector(Engine.playableArea.min.x - this.position.x, firstBarPos.y - this.borderSize),
                new Vector(Engine.playableArea.max.x - this.position.x, firstBarPos.y - this.borderSize),
                new Vector(Engine.playableArea.max.x - this.position.x, firstBarPos.y + this.borderSize),
                new Vector(Engine.playableArea.min.x - this.position.x, firstBarPos.y + this.borderSize),
            ],
            fillColour: "#6D0AD0",
            strokeColour: "#eaeaea",
        })
        drawObjects.push({
            drawPoints: [
                new Vector(Engine.playableArea.min.x - this.position.x, secondBarPos.y - this.borderSize),
                new Vector(Engine.playableArea.max.x - this.position.x, secondBarPos.y - this.borderSize),
                new Vector(Engine.playableArea.max.x - this.position.x, secondBarPos.y + this.borderSize),
                new Vector(Engine.playableArea.min.x - this.position.x, secondBarPos.y + this.borderSize),
            ],
            fillColour: "#6D0AD0",
            strokeColour: "#eaeaea",
        })

        return drawObjects;
    }

    swapActivePlayer() {
        if (this.currentActivePlayer == "Naught")
            this.currentActivePlayer = "Cross"
        else this.currentActivePlayer = "Naught"
    }

    update(): null {
        for (let mouseClick of Engine.mouseClickPositions) {
            if (Engine.playableArea.pointIntersects(mouseClick))
                for (let xCells of this.cells) {
                    for (let yCell of xCells) {
                        if (yCell.handleMouseEvent(mouseClick, this.currentActivePlayer)) {
                            this.swapActivePlayer();
                            return null;
                        }
                    }
                }
        }
    }

    draw() {
        this.drawByLine();
    }
}

export { Grid }