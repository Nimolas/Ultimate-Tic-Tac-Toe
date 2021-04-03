import { Vector } from "../utils/vector.js"

class MinMax {
    min: Vector;
    max: Vector;

    constructor(min: Vector, max: Vector) {
        this.min = min;
        this.max = max;
    }

    pointIntersects(point: Vector): boolean {
        if (point.x > this.min.x && point.y > this.min.y &&
            point.x < this.max.x && point.y < this.max.y)
            return true;
        return false;
    }
}

export { MinMax }