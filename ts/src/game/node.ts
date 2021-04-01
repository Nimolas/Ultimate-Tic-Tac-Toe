import { minMax } from "../engine/engine.js";
import { DrawObject, GameObject } from "../engine/gameObject.js";
import { Vector } from "../engine/vector.js";
import { Cell } from "./cell.js";

class Node extends GameObject {
    borderSize: number = 2;
    drawType: string = "";
    constructor(position: Vector, minMax: minMax) {
        super(position);

        this.drawType = "Naught"
        this.setDrawObject(this.generateNaught(minMax))
    }

    generateCross(cellMinMax: minMax): DrawObject[] {
        cellMinMax = {
            min: this.toLocalCoords(cellMinMax.min),
            max: this.toLocalCoords(cellMinMax.max)
        }

        cellMinMax = {
            min: new Vector(cellMinMax.min.x * .7, cellMinMax.min.y * .7),
            max: new Vector(cellMinMax.max.x * .7, cellMinMax.max.y * .7)
        }

        return [
            {
                drawPoints: [
                    new Vector(cellMinMax.min.x + this.borderSize, cellMinMax.min.y),
                    new Vector(cellMinMax.min.x, cellMinMax.min.y + this.borderSize),
                    new Vector(cellMinMax.max.x - this.borderSize, cellMinMax.max.y),
                    new Vector(cellMinMax.max.x, cellMinMax.max.y - this.borderSize),
                ],
                fillColour: "#8b0000",
                strokeColour: "#eaeaea"
            },
            {
                drawPoints: [
                    new Vector(cellMinMax.min.x + this.borderSize, cellMinMax.max.y),
                    new Vector(cellMinMax.min.x, cellMinMax.max.y - this.borderSize),
                    new Vector(cellMinMax.max.x - this.borderSize, cellMinMax.min.y),
                    new Vector(cellMinMax.max.x, cellMinMax.min.y + this.borderSize),
                ],
                fillColour: "#8b0000",
                strokeColour: "#eaeaea"
            }
        ]
    }

    generateNaught(cellMinMax: minMax): DrawObject[] {
        cellMinMax = {
            min: this.toLocalCoords(cellMinMax.min),
            max: this.toLocalCoords(cellMinMax.max)
        }

        cellMinMax = {
            min: new Vector(cellMinMax.min.x * .65, cellMinMax.min.y * .65),
            max: new Vector(cellMinMax.max.x * .65, cellMinMax.max.y * .65)
        }

        let distAvg: Vector = new Vector(
            (cellMinMax.max.x - cellMinMax.min.x) / 2,
            (cellMinMax.max.y - cellMinMax.min.y) / 2
        )
        let radius: number = (distAvg.x + distAvg.y) / 2;

        return [
            {
                drawPoints: [
                    new Vector(radius, radius),
                ],
                fillColour: "#17517e",
                strokeColour: "#eaeaea"
            },
            {
                drawPoints: [
                    new Vector(radius * .85, radius * .85),
                ],
                fillColour: "#000000",
                strokeColour: "#eaeaea"
            }
        ]
    }

    draw(): void {
        if (this.drawType == "Cross")
            this.drawByLine()
        else this.drawByArc();
    }
}

export { Node }