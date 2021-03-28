import { GameObject } from "../engine/gameObject.js";

class Node extends GameObject {
    constructor(x: number, y: number) {
        super(x, y);
    }
}

export { Node }