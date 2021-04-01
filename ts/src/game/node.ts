import { DrawObject, GameObject } from "../engine/gameObject.js";
import { MinMax } from "../engine/minMax.js";
import { Vector } from "../engine/vector.js";

class Node extends GameObject {
    borderSize: number = 2;
    drawType: string = "";
    nodeMinMax: MinMax;
    constructor(position: Vector, minMax: MinMax) {
        super(position);
        this.nodeMinMax = minMax;
        this.setDrawObject([{ drawPoints: [new Vector(0, 0)] }])
    }

    generateCross(nodeMinMax: MinMax): DrawObject[] {
        nodeMinMax = new MinMax(
            this.toLocalCoords(nodeMinMax.min),
            this.toLocalCoords(nodeMinMax.max)
        )

        nodeMinMax = new MinMax(
            new Vector(nodeMinMax.min.x * .7, nodeMinMax.min.y * .7),
            new Vector(nodeMinMax.max.x * .7, nodeMinMax.max.y * .7)
        )

        return [
            {
                drawPoints: [
                    new Vector(nodeMinMax.min.x + this.borderSize, nodeMinMax.min.y),
                    new Vector(nodeMinMax.min.x, nodeMinMax.min.y + this.borderSize),
                    new Vector(nodeMinMax.max.x - this.borderSize, nodeMinMax.max.y),
                    new Vector(nodeMinMax.max.x, nodeMinMax.max.y - this.borderSize),
                ],
                fillColour: "#8b0000",
                strokeColour: "#eaeaea"
            },
            {
                drawPoints: [
                    new Vector(nodeMinMax.min.x + this.borderSize, nodeMinMax.max.y),
                    new Vector(nodeMinMax.min.x, nodeMinMax.max.y - this.borderSize),
                    new Vector(nodeMinMax.max.x - this.borderSize, nodeMinMax.min.y),
                    new Vector(nodeMinMax.max.x, nodeMinMax.min.y + this.borderSize),
                ],
                fillColour: "#8b0000",
                strokeColour: "#eaeaea"
            }
        ]
    }

    generateNaught(nodeMinMax: MinMax): DrawObject[] {
        nodeMinMax = new MinMax(
            this.toLocalCoords(nodeMinMax.min),
            this.toLocalCoords(nodeMinMax.max)
        )

        nodeMinMax = new MinMax(
            new Vector(nodeMinMax.min.x * .65, nodeMinMax.min.y * .65),
            new Vector(nodeMinMax.max.x * .65, nodeMinMax.max.y * .65)
        )

        let dist: Vector = new Vector(
            nodeMinMax.max.x - nodeMinMax.min.x,
            nodeMinMax.max.y - nodeMinMax.min.y
        )

        let radius: number = dist.x < dist.y ? dist.x / 2 : dist.y / 2

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

    setDrawType(currentActivePlayer: string): boolean {
        if (this.drawType == "") {
            this.drawType = currentActivePlayer;

            if (this.drawType == "Cross")
                this.setDrawObject(this.generateCross(this.nodeMinMax))
            else this.setDrawObject(this.generateNaught(this.nodeMinMax))

            return true;
        }
        return false;
    }

    draw(): void {
        if (this.drawType == "Cross")
            this.drawByLine()
        else this.drawByCircle();
    }
}

export { Node }