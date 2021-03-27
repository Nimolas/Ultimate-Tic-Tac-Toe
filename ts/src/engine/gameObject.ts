import { minMax, Engine } from './engine.js'
import { Vector } from "./vector.js"

interface drawObjectElement {
    drawPoints: Vector[],
    fillColour: string,
    strokeColour: string,
    minMax?: minMax
}

interface drawObject {
    [index: number]: drawObjectElement
}

class GameObject {
    drawObject: drawObject = {};
    position: Vector = null;
    toDelete = false;
    minMax: minMax

    constructor(x: number, y: number) {
        this.position = new Vector(x, y);
    }

    destructor() {
        delete this.drawObject;
        delete this.position;
        delete this.minMax;
    }

    setDrawObject(drawObject: drawObject) {
        this.drawObject = drawObject;
        this.getObjectBounds();
    }

    getMinMax() {
        return this.minMax;
    }

    checkDelete(gameObjects: GameObject[]): void {
        return null;
    }

    update(gameObjects: GameObject[]): void {
        return null;
    }

    detectAABBCollision(other: GameObject) {
        let collisions = {
            minX: false, maxX: false, minY: false, maxY: false
        }

        let otherMinGlobal = other.toGlobalCoords(other.getMinMax().min);
        let otherMaxGlobal = other.toGlobalCoords(other.getMinMax().max);

        let thisMinGlobal = this.toGlobalCoords(this.getMinMax().min)
        let thisMaxGlobal = this.toGlobalCoords(this.getMinMax().max)

        if (otherMinGlobal.x > thisMinGlobal.x
            && otherMinGlobal.x < thisMaxGlobal.x)
            collisions.minX = true;
        if (otherMaxGlobal.x > thisMinGlobal.x
            && otherMaxGlobal.x < thisMaxGlobal.x)
            collisions.maxX = true;


        if (otherMinGlobal.y > thisMinGlobal.y
            && otherMinGlobal.y < thisMaxGlobal.y)
            collisions.minY = true;
        if (otherMaxGlobal.y > thisMinGlobal.y
            && otherMaxGlobal.y < thisMaxGlobal.y)
            collisions.maxY = true;

        return (collisions.minX || collisions.maxX) && (collisions.minY || collisions.maxY); //If horizontal point and vertical point overlapping, doesn't matter which ones or if multiple of either
    }

    assignIndividualObjectBounds() {
        Object.values(this.drawObject).forEach(function (obj: drawObjectElement) {
            let min = new Vector(1000000, 1000000);
            let max = new Vector(-1000000, -1000000);

            obj.drawPoints.forEach(function (point: Vector) {
                if (point.x < min.x)
                    min = new Vector(point.x, min.y)
                if (point.y < min.y)
                    min = new Vector(min.x, point.y)

                if (point.x > max.x)
                    max = new Vector(point.x, max.y)
                if (point.y > max.y)
                    max = new Vector(max.x, point.y)
            });

            let minMax = {
                min: min,
                max: max
            }

            obj.minMax = minMax; //Assign each individual part of a drawObject's minMax
        })
    }

    rotateAroundPoint(point: Vector, angle: number) {
        this.position = Vector.rotateVectorAroundPoint(this.position, point, angle)
    }

    translatePosition(otherVector: Vector) {
        this.position = Vector.translate(this.position, otherVector);
    }

    assignTotalObjectBounds() {
        let min = new Vector(1000000, 1000000);
        let max = new Vector(-1000000, -1000000);

        Object.values(this.drawObject).forEach(obj => {
            if (obj.minMax.max.x > max.x)
                max = new Vector(obj.minMax.max.x, max.y)
            if (obj.minMax.max.y > max.y)
                max = new Vector(max.x, obj.minMax.max.y)
            if (obj.minMax.min.x < min.x)
                min = new Vector(obj.minMax.min.x, min.y)
            if (obj.minMax.min.y < min.y)
                min = new Vector(min.x, obj.minMax.min.y)
        })

        let minMax = {
            min: min,
            max: max
        }

        this.minMax = minMax; //Assign overall box of the entire object
    }

    getObjectBounds() { //Used to find the AABB (Axis-Aligned Bounding Box). Basically the basic box around the object to be used as primitive hit detection
        this.assignIndividualObjectBounds();
        this.assignTotalObjectBounds();
    }

    draw() {
        this.drawByLine();
    }

    toGlobalCoords(localVector: Vector) {
        return new Vector(this.position.x + localVector.x, this.position.y + localVector.y);
    }

    getWidth() {
        return this.getMinMax().max.x - this.getMinMax().min.x
    }

    getHeight() {
        return this.getMinMax().max.y - this.getMinMax().min.y
    }

    drawByLine() {
        Object.values(this.drawObject).forEach(drawable => {
            Engine.context.beginPath();
            Engine.context.moveTo(this.toGlobalCoords(drawable.drawPoints[0]).x, this.toGlobalCoords(drawable.drawPoints[0]).y);

            drawable.drawPoints.forEach(function (drawPoint: Vector) {
                if (drawPoint != drawable.drawPoints[0]) {
                    let drawPointGlobal = this.toGlobalCoords(drawPoint);
                    Engine.context.lineTo(drawPointGlobal.x, drawPointGlobal.y)
                }
            });

            Engine.context.closePath();
            this.setDrawModes(drawable.strokeColour, drawable.fillColour);
        });
    }

    drawByPixel() {
        Object.values(this.drawObject).forEach(drawable => {
            Engine.context.beginPath();

            drawable.drawPoints.forEach(function (drawPoint: Vector) {
                let drawPointGlobal = this.toGlobalCoords(drawPoint);
                Engine.context.rect(drawPointGlobal.x, drawPointGlobal.y, 1, 1);
            });

            Engine.context.closePath();
            this.setDrawModes(drawable.strokeColour, drawable.fillColour);
        });
    }

    setDrawModes(strokeStyle: string, fillStyle: string) {
        if (strokeStyle != "" || undefined) {
            Engine.context.strokeStyle = strokeStyle
            Engine.context.stroke();
        }
        if (fillStyle != "" || undefined) {
            Engine.context.fillStyle = fillStyle
            Engine.context.fill();
        }
    }
}

export { GameObject, drawObject }