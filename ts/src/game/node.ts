import { minMax } from "../engine/engine.js";
import { DrawObject, GameObject } from "../engine/gameObject.js";
import { Vector } from "../engine/vector.js";

class Node extends GameObject {
    constructor(position: Vector, minMax: minMax) {
        super(position);

        let drawObject: DrawObject[] = [
            { drawPoints: [this.toLocalCoords(this.position)] }
        ]

        this.setDrawObject(drawObject)
    }

    draw(): void {
        this.drawAPixel(this.position)
    }
}

export { Node }