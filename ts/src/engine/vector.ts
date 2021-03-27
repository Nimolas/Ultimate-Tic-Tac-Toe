class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static translate(vector_1: Vector, vector_2: Vector) {
        return new Vector(
            vector_1.x + vector_2.x,
            vector_1.y + vector_2.y
        );
    }

    static rotateVectorAroundPoint(vector: Vector, point: Vector, angle: number) {
        let radians = angle * (Math.PI / 180);

        let sine = Math.sin(radians);
        let cosine = Math.cos(radians);

        let temp = new Vector(
            vector.x - point.x,
            vector.y - point.y
        )

        let newX = temp.x * cosine - temp.y * sine;
        let newY = temp.x * sine + temp.y * cosine;

        temp.x = newX + point.x
        temp.y = newY + point.y;

        return temp;
    }
}