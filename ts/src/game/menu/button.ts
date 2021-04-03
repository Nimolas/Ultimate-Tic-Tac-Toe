import { GameObject } from "../../engine/gameObject.js";
import { MinMax } from "../../engine/minMax.js";
import { Vector } from "../../engine/vector.js";
import "../../engine/extensions.js"

class Button extends GameObject {
    constructor(position: Vector, area: MinMax, text: string) {
        super(position);

        this.setDrawObject([
            {
                drawPoints: [
                    this.toLocalCoords(new Vector(area.min.x, area.min.y)),
                    this.toLocalCoords(new Vector(area.max.x, area.min.y)),
                    this.toLocalCoords(new Vector(area.max.x, area.max.y)),
                    this.toLocalCoords(new Vector(area.min.x, area.max.y)),
                ],
                fillColour: "#6D0AD0"
            }])

        let minMaxDist: Vector = new Vector(
            this.minMax.max.x - this.minMax.min.x,
            this.minMax.max.y - this.minMax.min.y
        )

        this.drawObjects.push({
            drawPoints: [
                new Vector(0, 0)
            ],
            strokeColour: "#ffffff",
            text: text
        })
        this.getObjectBounds();
    }

    draw() {
        this.drawByLine(this.drawObjects.slice(0, 1));
        this.drawByText(this.drawObjects.last().text, this.drawObjects.last().drawPoints[0],)
    }
}

export { Button }