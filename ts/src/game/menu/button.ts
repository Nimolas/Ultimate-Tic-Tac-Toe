import { GameObject } from "../../engine/gameobjects/gameObject.js";
import { MinMax } from "../../engine/gameobjects/minMax.js";
import { Vector } from "../../engine/utils/vector.js";
import "../../engine/utils/extensions.js"

class Button extends GameObject {
    constructor(position: Vector, dist: Vector, text: string) {
        super(position);

        this.setDrawObject([
            {
                drawPoints: [
                    new Vector(-(dist.x / 2), -(dist.y / 2)),
                    new Vector(dist.x / 2, -(dist.y / 2)),
                    new Vector(dist.x / 2, dist.y / 2),
                    new Vector(-(dist.x / 2), dist.y / 2),
                ],
                fillColour: "#6D0AD0"
            },
            {
                drawPoints: [
                    new Vector(0, 0)
                ],
                strokeColour: "#ffffff",
                text: text
            }])
    }

    handleMouseEvents(): void {
        return null; //Overwrite this in the thing calling it to control what it does;
    }

    update(thing: any): any {
        this.handleMouseEvents();
    }

    draw() {
        this.drawByLine(this.drawObjects.slice(0, 1));
        this.drawByText(this.drawObjects.last().text, this.toGlobalCoords(this.drawObjects.last().drawPoints[0]), this.drawObjects.last().strokeColour, "40px")
    }
}

export { Button }