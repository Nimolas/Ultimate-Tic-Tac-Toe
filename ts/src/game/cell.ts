import { DrawObject, GameObject, } from "../engine/gameObject.js";
import { MinMax } from "../engine/minMax.js";
import { Vector } from "../engine/vector.js";
import { Node } from "./node.js"

class Cell extends GameObject {
    nodes: Node[][] = [];
    active: boolean = true;
    completed: boolean = false;
    winningPlayer: string;
    borderSize: number = 0.5;
    cellMinMax: MinMax;
    naughtColour: string = "rgba(23,81,126,0.3)"
    crossColour: string = "rgba(139,0,0,0.3)"

    constructor(position: Vector, cellMinMax: MinMax, gameObjects: GameObject[]) {
        super(position);
        this.cellMinMax = cellMinMax;

        let dist: Vector = new Vector(
            cellMinMax.max.x - cellMinMax.min.x,
            cellMinMax.max.y - cellMinMax.min.y
        )

        let minMax = new MinMax( //Scale the area of a cell to be 5% less on each side
            new Vector(cellMinMax.min.x + (dist.x * 0.05), cellMinMax.min.y + (dist.y * 0.05)),
            new Vector(cellMinMax.max.x - (dist.x * 0.05), cellMinMax.max.y - (dist.y * 0.05))
        )

        let xThird: number = (minMax.max.x - minMax.min.x) / 3;
        let yThird: number = (minMax.max.y - minMax.min.y) / 3;

        let minX: number = minMax.min.x
        let minY: number = minMax.min.y

        for (let x = 0; x < 3; x++) {
            this.nodes.push([]);
            if (x > 0)
                minX = minX + xThird;
            else minX = minMax.min.x

            let maxX: number = minX + xThird

            for (let y = 0; y < 3; y++) {
                if (y > 0)
                    minY = minY + yThird
                else minY = minMax.min.y

                let maxY: number = minY + yThird

                let nodePos = new Vector(
                    (minX + maxX) / 2,
                    (minY + maxY) / 2
                )

                let minMaxNode: MinMax = new MinMax(new Vector(minX, minY), new Vector(maxX, maxY));

                let node: Node = new Node(nodePos, minMaxNode)
                gameObjects.push(node);
                this.nodes[x].push(node);
            }
        }

        this.setDrawObject(this.generateDrawObject(minMax))
    }

    generateDrawObject(minMax: MinMax): DrawObject[] {

        let xThird: number = (minMax.max.x - minMax.min.x) / 3;
        let yThird: number = (minMax.max.y - minMax.min.y) / 3;

        let firstBarPos: Vector = this.toLocalCoords(new Vector(
            minMax.min.x + xThird,
            minMax.min.y + yThird
        ))

        let secondBarPos: Vector = this.toLocalCoords(new Vector(
            minMax.max.x - xThird,
            minMax.max.y - yThird
        ))

        let drawObjects: DrawObject[] = [];
        drawObjects.push({
            drawPoints: [
                this.toLocalCoords(new Vector(minMax.min.x, minMax.min.y)),
                this.toLocalCoords(new Vector(minMax.max.x, minMax.min.y)),
                this.toLocalCoords(new Vector(minMax.max.x, minMax.max.y)),
                this.toLocalCoords(new Vector(minMax.min.x, minMax.max.y)),
            ],
            fillColour: "rgba(225, 225, 225, 0.3)",
        })
        drawObjects.push({
            drawPoints: [
                new Vector(firstBarPos.x - this.borderSize, minMax.min.y - this.position.y),
                new Vector(firstBarPos.x + this.borderSize, minMax.min.y - this.position.y),
                new Vector(firstBarPos.x + this.borderSize, minMax.max.y - this.position.y),
                new Vector(firstBarPos.x - this.borderSize, minMax.max.y - this.position.y),
            ],
            fillColour: "#eaeaea",
        })
        drawObjects.push({
            drawPoints: [
                new Vector(secondBarPos.x - this.borderSize, minMax.min.y - this.position.y),
                new Vector(secondBarPos.x + this.borderSize, minMax.min.y - this.position.y),
                new Vector(secondBarPos.x + this.borderSize, minMax.max.y - this.position.y),
                new Vector(secondBarPos.x - this.borderSize, minMax.max.y - this.position.y),
            ],
            fillColour: "#eaeaea",
        })
        drawObjects.push({
            drawPoints: [
                new Vector(minMax.min.x - this.position.x, firstBarPos.y - this.borderSize),
                new Vector(minMax.max.x - this.position.x, firstBarPos.y - this.borderSize),
                new Vector(minMax.max.x - this.position.x, firstBarPos.y + this.borderSize),
                new Vector(minMax.min.x - this.position.x, firstBarPos.y + this.borderSize),
            ],
            fillColour: "#eaeaea",
        })
        drawObjects.push({
            drawPoints: [
                new Vector(minMax.min.x - this.position.x, secondBarPos.y - this.borderSize),
                new Vector(minMax.max.x - this.position.x, secondBarPos.y - this.borderSize),
                new Vector(minMax.max.x - this.position.x, secondBarPos.y + this.borderSize),
                new Vector(minMax.min.x - this.position.x, secondBarPos.y + this.borderSize),
            ],
            fillColour: "#eaeaea",
        })

        return drawObjects;
    }

    generateWinLine(position1: Vector, position2: Vector): DrawObject {
        return {
            drawPoints: [
                this.toLocalCoords(new Vector(position1.x, position1.y)),
                this.toLocalCoords(new Vector(position2.x, position2.y))
            ],
            fillColour: "#046827",
            strokeColour: "#eaeaea"
        }
    }

    checkWin(playerType: string): boolean {
        for (let x = 0; x < 3; x++) {
            if (this.nodes[x][0].drawType == playerType &&
                this.nodes[x][1].drawType == playerType &&
                this.nodes[x][2].drawType == playerType) {

                this.drawObjects[0].fillColour = playerType == "Naught" ? this.naughtColour : this.crossColour;
                this.drawObjects.push(this.generateWinLine(this.nodes[x][0].position, this.nodes[x][2].position))
                this.winningPlayer = playerType;
                return true;
            }
        }

        for (let y = 0; y < 3; y++) {
            if (this.nodes[0][y].drawType == playerType &&
                this.nodes[1][y].drawType == playerType &&
                this.nodes[2][y].drawType == playerType) {

                this.drawObjects[0].fillColour = playerType == "Naught" ? this.naughtColour : this.crossColour;
                this.drawObjects.push(this.generateWinLine(this.nodes[0][y].position, this.nodes[2][y].position))
                this.winningPlayer = playerType;
                return true;
            }
        }

        if (this.nodes[0][0].drawType == playerType &&
            this.nodes[1][1].drawType == playerType &&
            this.nodes[2][2].drawType == playerType) {

            this.drawObjects[0].fillColour = playerType == "Naught" ? this.naughtColour : this.crossColour;
            this.drawObjects.push(this.generateWinLine(this.nodes[0][0].position, this.nodes[2][2].position))
            this.winningPlayer = playerType;
            return true;
        }

        if (this.nodes[0][2].drawType == playerType &&
            this.nodes[1][1].drawType == playerType &&
            this.nodes[2][0].drawType == playerType) {

            this.drawObjects[0].fillColour = playerType == "Naught" ? this.naughtColour : this.crossColour;
            this.drawObjects.push(this.generateWinLine(this.nodes[0][2].position, this.nodes[2][0].position))
            this.winningPlayer = playerType;
            return true;
        }

        return false;
    }

    update(): void {
        let won: boolean = false;

        if (!this.completed) {
            if (this.checkWin("Naught") || this.checkWin("Cross"))
                won = true;

            if (won) {
                this.completed = true;
                this.active = false
            }
        }
    }

    handleMouseEvent(mouseClick: Vector, currentActivePlayer: string): boolean {
        if (this.active) {
            if (this.cellMinMax.pointIntersects(mouseClick))
                for (let xNodes of this.nodes) {
                    for (let yNode of xNodes) {
                        if (yNode.nodeMinMax.pointIntersects(mouseClick))
                            if (yNode.setDrawType(currentActivePlayer))
                                return true;
                    }
                }
        }
        return false;
    }

    draw() {
        if (this.active || this.completed)
            this.drawByLine(this.drawObjects.slice(0, 1));
        this.drawByLine(this.drawObjects.slice(1, this.drawObjects.length));
    }
}

export { Cell }