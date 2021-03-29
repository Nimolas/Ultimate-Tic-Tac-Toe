import { Engine, minMax } from "../engine/engine.js";
import { DrawObject, GameObject, } from "../engine/gameObject.js";
import { Vector } from "../engine/vector.js";
import { Node } from "./node.js"

class Cell extends GameObject {
    nodes: Node[][] = [];
    active: boolean = true;
    borderSize: number = 2.5;

    constructor(position: Vector, minMax: minMax, gameObjects: GameObject[]) {
        super(position);

        for (let x = 0; x < 3; x++) {
            this.nodes.push([]);

            for (let y = 0; y < 3; y++) {

                let node = new Node(new Vector(0, 0));

                gameObjects.push(node)
                this.nodes[x].push(node);
            }
        }

        let xDist = minMax.max.x - minMax.min.x;
        let yDist = minMax.max.y - minMax.min.y;

        minMax = { //Scale the area of a cell to be 5% less on each side
            min: new Vector(minMax.min.x + (xDist * 0.95), minMax.min.y + (yDist * 0.95)),
            max: new Vector(minMax.max.x - (xDist * 0.95), minMax.max.y - (yDist * 0.95))
        }

        this.setDrawObject(this.generateDrawObject(minMax))
    }

    generateDrawObject(minMax: minMax): DrawObject[] {

        let xThird = (minMax.max.x - minMax.min.x) / 3;
        let yThird = (minMax.max.y - minMax.min.y) / 3;

        let xFirstBarPos = (minMax.min.x + xThird) - this.position.x;
        let xSecondBarPos = (minMax.max.x - xThird) - this.position.x;

        let yFirstBarPos = (minMax.min.y + yThird) - this.position.y;
        let ySecondBarPos = (minMax.max.y - yThird) - this.position.y;

        console.log("Cell pos: ", this.position)

        let drawObjects: DrawObject[] = [];
        drawObjects.push({
            drawPoints: [
                new Vector(xFirstBarPos - this.borderSize, minMax.min.y - this.position.y),
                new Vector(xFirstBarPos + this.borderSize, minMax.min.y - this.position.y),
                new Vector(xFirstBarPos + this.borderSize, minMax.max.y - this.position.y),
                new Vector(xFirstBarPos - this.borderSize, minMax.max.y - this.position.y),
            ],
            fillColour: "#eaeaea",
        })
        drawObjects.push({
            drawPoints: [
                new Vector(xSecondBarPos - this.borderSize, minMax.min.y - this.position.y),
                new Vector(xSecondBarPos + this.borderSize, minMax.min.y - this.position.y),
                new Vector(xSecondBarPos + this.borderSize, minMax.max.y - this.position.y),
                new Vector(xSecondBarPos - this.borderSize, minMax.max.y - this.position.y),
            ],
            fillColour: "#eaeaea",
        })
        drawObjects.push({
            drawPoints: [
                new Vector(minMax.min.x - this.position.x, yFirstBarPos - this.borderSize),
                new Vector(minMax.max.x - this.position.x, yFirstBarPos - this.borderSize),
                new Vector(minMax.max.x - this.position.x, yFirstBarPos + this.borderSize),
                new Vector(minMax.min.x - this.position.x, yFirstBarPos + this.borderSize),
            ],
            fillColour: "#eaeaea",
        })
        drawObjects.push({
            drawPoints: [
                new Vector(minMax.min.x - this.position.x, ySecondBarPos - this.borderSize),
                new Vector(minMax.max.x - this.position.x, ySecondBarPos - this.borderSize),
                new Vector(minMax.max.x - this.position.x, ySecondBarPos + this.borderSize),
                new Vector(minMax.min.x - this.position.x, ySecondBarPos + this.borderSize),
            ],
            fillColour: "#eaeaea",
        })

        return drawObjects;
    }
}

export { Cell }