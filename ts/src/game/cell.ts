import { GameObject } from "../engine/gameObject.js";
import { Node } from "./node.js"

class Cell extends GameObject {
    nodes: Node[][];

    constructor(x: number, y: number) {
        super(x, y);
    }
}

export { Cell }