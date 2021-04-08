import { Engine } from "../../engine/engine.js";
import { DrawObject, GameObject } from "../../engine//gameobjects/gameObject.js";
import { MinMax } from "../../engine//gameobjects/minMax.js";
import { Vector } from "../../engine/utils/vector.js";
import { Cell, PickedNode } from "./cell.js";
import { GridObject } from "./gridObject.js";

class Grid extends GridObject {
    cells: Cell[][] = [];
    currentActivePlayer: string = "Cross";

    constructor(AIActive: boolean, position?: Vector, gameObjects?: GameObject[]) {
        super(position);
        if (!AIActive) {
            this.borderSize = 2;

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

                    let cell: Cell = new Cell(AIActive, cellPos, boundary, gameObjects)
                    gameObjects.push(cell);
                    this.cells[x].push(cell);
                }
            }

            this.setDrawObject(this.generateDrawObject(xThird, yThird))
        } else {
            for (let x = 0; x < 3; x++) {
                this.cells.push([]);
                for (let y = 0; y < 3; y++) {
                    let cell: Cell = new Cell(AIActive);
                    this.cells[x].push(cell);
                }
            }
        }
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

    disableAllCells(): void {
        for (let cells of this.cells)
            for (let cell of cells) {
                cell.active = false;
            }
    }

    activateAllNonCompletedCells(): void {
        for (let cells of this.cells)
            for (let cell of cells) {
                if (!cell.completed)
                    cell.active = true;
            }
    }

    setNodeForAI(xCellIndex: number, yCellIndex: number, xNodeIndex: number, yNodeIndex: number, currentPlayer: string): boolean {
        let result = this.cells[xCellIndex][yCellIndex].setDrawTypeForAI(xNodeIndex, yNodeIndex, currentPlayer)

        if (result.picked) {
            this.disableAllCells();
            if (!this.cells[result.nodeX][result.nodeY].completed)
                this.cells[result.nodeX][result.nodeY].active = true;
            else
                this.activateAllNonCompletedCells();
            return true;
        }
        return false;
    }

    handleMouseEvents(): null {
        for (let mouseClick of Engine.mouseClickPositions) {
            if (Engine.playableArea.pointIntersects(mouseClick)) {
                for (let xCells of this.cells) {
                    for (let yCell of xCells) {
                        let result: PickedNode = yCell.handleMouseEvent(mouseClick, this.currentActivePlayer)

                        if (result.picked) {
                            this.swapActivePlayer();
                            this.disableAllCells();
                            if (!this.cells[result.nodeX][result.nodeY].completed)
                                this.cells[result.nodeX][result.nodeY].active = true;
                            else
                                this.activateAllNonCompletedCells();
                            return null;
                        }
                    }
                }
            }
        }
    }

    update(): void {
        this.handleMouseEvents();
        if (this.checkWinState(false, this.cells))
            this.disableAllCells();
    }

    draw() {
        this.drawByLine();
    }
}

export { Grid }