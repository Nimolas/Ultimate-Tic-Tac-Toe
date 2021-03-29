import { DrawObject, GameObject } from "../engine/gameObject.js";
import { Vector } from "../engine/vector.js";

class Node extends GameObject {
    constructor(position: Vector) {
        super(position);

        let drawObject: DrawObject[] = [
            { drawPoints: [this.position] }
        ]

        this.setDrawObject(drawObject)
    }
}

export { Node }