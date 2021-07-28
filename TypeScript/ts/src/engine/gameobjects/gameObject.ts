import { Engine } from '../engine.js'
import { MinMax } from './minMax.js';
import { Vector } from "../utils/vector.js"

interface DrawObject {
    drawPoints: Vector[],
    fillColour?: string,
    strokeColour?: string,
    minMax?: MinMax
    text?: string;
}

class GameObject {
    drawObjects: DrawObject[] = [];
    position: Vector = null;
    toDelete: boolean = false;
    minMax: MinMax;

    constructor(position: Vector) {
        this.position = position;
    }

    destructor() {
        this.drawObjects = undefined;
        this.position = undefined;
        this.minMax = undefined;
    }

    setDrawObject(drawObject: DrawObject[]) {
        this.drawObjects = drawObject;
        this.getObjectBounds();
    }

    getMinMax() {
        return this.minMax;
    }

    checkDelete(gameObjects: GameObject[]): void {
        return null;
    }

    update(gameObjects: GameObject[]): void

    update(aiActive: boolean): null

    update(thing: any): any {
        return null;
    }

    detectAABBCollision(other: GameObject) {
        let collisions = {
            minX: false, maxX: false, minY: false, maxY: false
        }

        let otherMinGlobal: Vector = other.toGlobalCoords(other.getMinMax().min);
        let otherMaxGlobal: Vector = other.toGlobalCoords(other.getMinMax().max);

        let thisMinGlobal: Vector = this.toGlobalCoords(this.getMinMax().min)
        let thisMaxGlobal: Vector = this.toGlobalCoords(this.getMinMax().max)

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
        for (let drawObject of this.drawObjects) {
            let min: Vector = new Vector(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
            let max: Vector = new Vector(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);

            for (let point of drawObject.drawPoints) {
                if (point.x < min.x)
                    min = new Vector(point.x, min.y)
                if (point.y < min.y)
                    min = new Vector(min.x, point.y)

                if (point.x > max.x)
                    max = new Vector(point.x, max.y)
                if (point.y > max.y)
                    max = new Vector(max.x, point.y)
            };

            let minMax: MinMax = new MinMax(min, max);

            drawObject.minMax = minMax; //Assign each individual part of a drawObject's minMax
        }
    }

    rotateAroundPoint(point: Vector, angle: number) {
        this.position = Vector.rotateVectorAroundPoint(this.position, point, angle)
    }

    translatePosition(otherVector: Vector) {
        this.position = Vector.translate(this.position, otherVector);
    }

    assignTotalObjectBounds() {
        let min: Vector = new Vector(1000000, 1000000);
        let max: Vector = new Vector(-1000000, -1000000);

        for (let drawObject of this.drawObjects) {
            if (drawObject.minMax.max.x > max.x)
                max = new Vector(drawObject.minMax.max.x, max.y)
            if (drawObject.minMax.max.y > max.y)
                max = new Vector(max.x, drawObject.minMax.max.y)
            if (drawObject.minMax.min.x < min.x)
                min = new Vector(drawObject.minMax.min.x, min.y)
            if (drawObject.minMax.min.y < min.y)
                min = new Vector(min.x, drawObject.minMax.min.y)
        }

        let minMax: MinMax = new MinMax(min, max);

        this.minMax = minMax; //Assign overall box of the entire object
    }

    getObjectBounds() { //Used to find the AABB (Axis-Aligned Bounding Box). Basically the basic box around the object to be used as primitive hit detection
        this.assignIndividualObjectBounds();
        this.assignTotalObjectBounds();
    }

    draw() {
        this.drawByLine();
    }

    toGlobalCoords(localVector: Vector): Vector {
        return new Vector(this.position.x + localVector.x, this.position.y + localVector.y);
    }

    toLocalCoords(globalVector: Vector) {
        return new Vector(globalVector.x - this.position.x, globalVector.y - this.position.y)
    }

    getWidth() {
        return this.minMax.max.x - this.minMax.min.x
    }

    getHeight() {
        return this.minMax.max.y - this.minMax.min.y
    }

    drawAPixel(position: Vector) {
        Engine.context.beginPath();
        Engine.context.rect(position.x, position.y, 1, 1);
        Engine.context.closePath();
        this.setDrawModes("#eaeaea", "#eaeaea");
    }

    drawByLine(drawObjects: DrawObject[] = this.drawObjects) {
        for (let drawable of drawObjects) {
            Engine.context.beginPath();
            Engine.context.moveTo(this.toGlobalCoords(drawable.drawPoints[0]).x, this.toGlobalCoords(drawable.drawPoints[0]).y);

            for (let drawPoint of drawable.drawPoints) {
                if (drawPoint != drawable.drawPoints[0]) {
                    let drawPointGlobal = this.toGlobalCoords(drawPoint);
                    Engine.context.lineTo(drawPointGlobal.x, drawPointGlobal.y)
                }
            };

            Engine.context.closePath();
            this.setDrawModes(drawable.strokeColour, drawable.fillColour);
        };
    }

    drawByText(text: string, position: Vector, colour: string = "#ffffff", fontSize: string = "14px"): void {
        Engine.context.beginPath();
        Engine.context.font = `${fontSize} Gill Sans MT`;
        Engine.context.textAlign = "center";

        this.setDrawModes("", colour);
        Engine.context.fillText(text, position.x, position.y);
        Engine.context.closePath();
    }

    drawByPixel(drawObjects: DrawObject[] = this.drawObjects): void {
        for (let drawable of drawObjects) {
            Engine.context.beginPath();

            for (let drawPoint of drawable.drawPoints) {
                let drawPointGlobal = this.toGlobalCoords(drawPoint);
                Engine.context.rect(drawPointGlobal.x, drawPointGlobal.y, 1, 1);
            };

            Engine.context.closePath();
            this.setDrawModes(drawable.strokeColour, drawable.fillColour);
        };
    }

    drawByCircle(drawObjects: DrawObject[] = this.drawObjects): void {
        for (let drawable of drawObjects) {
            Engine.context.beginPath();

            for (let drawPoint of drawable.drawPoints) {
                Engine.context.arc(this.position.x, this.position.y, drawPoint.x, 0, 2 * Math.PI);
            };

            Engine.context.closePath();
            this.setDrawModes(drawable.strokeColour, drawable.fillColour);
        }
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

export { GameObject, DrawObject }