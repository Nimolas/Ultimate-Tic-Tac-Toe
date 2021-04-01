import { minMax } from "../engine/engine.js";
import { DrawObject, GameObject, } from "../engine/gameObject.js";
import { Vector } from "../engine/vector.js";
import { Node } from "./node.js"

class Cell extends GameObject {
    nodes: Node[][] = [];
    active: boolean = false;
    completed: boolean = false;
    borderSize: number = 0.5;

    constructor(position: Vector, minMax: minMax, gameObjects: GameObject[]) {
        super(position);

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

                let minMaxNode: minMax = {
                    min: new Vector(minX, minY),
                    max: new Vector(maxX, maxY)
                }

                let node: Node = new Node(nodePos, minMaxNode)
                gameObjects.push(node);
                this.nodes[x].push(node);
            }
        }

        let dist: Vector = new Vector(
            minMax.max.x - minMax.min.x,
            minMax.max.y - minMax.min.y
        )

        minMax = { //Scale the area of a cell to be 5% less on each side
            min: new Vector(minMax.min.x + (dist.x * 0.95), minMax.min.y + (dist.y * 0.95)),
            max: new Vector(minMax.max.x - (dist.x * 0.95), minMax.max.y - (dist.y * 0.95))
        }

        this.setDrawObject(this.generateDrawObject(minMax))
    }

    generateDrawObject(minMax: minMax): DrawObject[] {

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

    draw() {
        if (this.active || this.completed)
            this.drawByLine(this.drawObjects.slice(0, 1));
        this.drawByLine(this.drawObjects.slice(1, this.drawObjects.length));
    }
}

export { Cell }