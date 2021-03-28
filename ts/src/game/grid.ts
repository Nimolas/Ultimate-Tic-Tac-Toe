import { Engine } from "../engine/engine.js";
import { DrawObject, GameObject } from "../engine/gameObject.js";
import { Vector } from "../engine/vector.js";
import { Cell } from "./cell.js";

class Grid extends GameObject {
    cells: Cell[][];

    constructor(x: number, y: number) {
        super(x, y);
        this.setDrawObject(this.generateDrawObject())
    }

    generateDrawObject(): DrawObject[] {

        let xThird = (Engine.playableArea.max.x - Engine.playableArea.min.x) / 3;
        let yThird = (Engine.playableArea.max.y - Engine.playableArea.min.y) / 3;

        let xFirstBarPos = (Engine.playableArea.min.x + xThird) - this.position.x;
        let xSecondBarPos = (Engine.playableArea.max.x - xThird) - this.position.x;

        let yFirstBarPos = (Engine.playableArea.min.y + yThird) - this.position.y;
        let ySecondBarPos = (Engine.playableArea.max.y - yThird) - this.position.y;

        console.log(this.position.x)
        console.log(xFirstBarPos)
        console.log(xSecondBarPos)

        let drawObjects: DrawObject[] = [];
        drawObjects.push({
            drawPoints: [
                new Vector(xFirstBarPos - 5, Engine.playableArea.min.y - this.position.y),
                new Vector(xFirstBarPos + 5, Engine.playableArea.min.y - this.position.y),
                new Vector(xFirstBarPos + 5, Engine.playableArea.max.y - this.position.y),
                new Vector(xFirstBarPos - 5, Engine.playableArea.max.y - this.position.y),
            ],
            fillColour: "#eaeaea",
        })
        drawObjects.push({
            drawPoints: [
                new Vector(xSecondBarPos - 5, Engine.playableArea.min.y - this.position.y),
                new Vector(xSecondBarPos + 5, Engine.playableArea.min.y - this.position.y),
                new Vector(xSecondBarPos + 5, Engine.playableArea.max.y - this.position.y),
                new Vector(xSecondBarPos - 5, Engine.playableArea.max.y - this.position.y),
            ],
            fillColour: "#eaeaea",
        })
        drawObjects.push({
            drawPoints: [
                new Vector(Engine.playableArea.min.x - this.position.x, yFirstBarPos - 5),
                new Vector(Engine.playableArea.max.x - this.position.x, yFirstBarPos - 5),
                new Vector(Engine.playableArea.max.x - this.position.x, yFirstBarPos + 5),
                new Vector(Engine.playableArea.min.x - this.position.x, yFirstBarPos + 5),
            ],
            fillColour: "#eaeaea",
        })
        drawObjects.push({
            drawPoints: [
                new Vector(Engine.playableArea.min.x - this.position.x, ySecondBarPos - 5),
                new Vector(Engine.playableArea.max.x - this.position.x, ySecondBarPos - 5),
                new Vector(Engine.playableArea.max.x - this.position.x, ySecondBarPos + 5),
                new Vector(Engine.playableArea.min.x - this.position.x, ySecondBarPos + 5),
            ],
            fillColour: "#eaeaea",
        })

        return drawObjects;
    }
}

export { Grid }