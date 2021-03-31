import { GameObject, DrawObject } from './gameObject.js'
import { Engine, minMax } from './engine.js'
import { Vector } from './vector.js'

class DebugObject extends GameObject {
    lastTime: number = null;
    fps: number = 0;
    constructor(position: Vector, playableArea: minMax) {
        super(position);

        let xMidPosition: number = playableArea.min.x + ((playableArea.max.x - playableArea.min.x) / 2);
        let yMidPosition: number = playableArea.min.y + ((playableArea.max.y - playableArea.min.y) / 2);

        let drawObject: DrawObject[] = [
            {
                "drawPoints": [
                    new Vector(playableArea.min.x - 1, playableArea.min.y),
                    new Vector(playableArea.min.x + 1, playableArea.min.y),
                    new Vector(playableArea.min.x + 1, playableArea.max.y),
                    new Vector(playableArea.min.x - 1, playableArea.max.y),
                ],
                "fillColour": "rgba(209, 49, 17, 0.45)",
                "strokeColour": ""
            },
            {
                "drawPoints": [
                    new Vector(playableArea.min.x, playableArea.min.y - 1),
                    new Vector(playableArea.max.x, playableArea.min.y - 1),
                    new Vector(playableArea.max.x, playableArea.min.y + 1),
                    new Vector(playableArea.min.x, playableArea.min.y + 1),
                ],
                "fillColour": "rgba(209, 49, 17, 0.45)",
                "strokeColour": ""
            },
            {
                "drawPoints": [
                    new Vector(playableArea.max.x + 1, playableArea.min.y),
                    new Vector(playableArea.max.x + 1, playableArea.max.y),
                    new Vector(playableArea.max.x - 1, playableArea.max.y),
                    new Vector(playableArea.max.x - 1, playableArea.min.y),
                ],
                "fillColour": "rgba(209, 49, 17, 0.45)",
                "strokeColour": ""
            },
            {
                "drawPoints": [
                    new Vector(playableArea.max.x, playableArea.max.y - 1),
                    new Vector(playableArea.max.x, playableArea.max.y + 1),
                    new Vector(playableArea.min.x, playableArea.max.y + 1),
                    new Vector(playableArea.min.x, playableArea.max.y - 1),
                ],
                "fillColour": "rgba(209, 49, 17, 0.45)",
                "strokeColour": ""
            },
            {
                "drawPoints": [
                    new Vector(xMidPosition - 1, playableArea.min.y),
                    new Vector(xMidPosition + 1, playableArea.min.y),
                    new Vector(xMidPosition + 1, playableArea.max.y),
                    new Vector(xMidPosition - 1, playableArea.max.y),
                ],
                "fillColour": "rgba(209, 49, 17, 0.45)",
                "strokeColour": ""
            },
            {
                "drawPoints": [
                    new Vector(playableArea.min.x, yMidPosition - 1),
                    new Vector(playableArea.max.x, yMidPosition - 1),
                    new Vector(playableArea.max.x, yMidPosition + 1),
                    new Vector(playableArea.min.x, yMidPosition + 1),
                ],
                "fillColour": "rgba(209, 49, 17, 0.45)",
                "strokeColour": ""
            },
        ]

        this.setDrawObject(drawObject)
    }

    getFPS() {
        return this.fps;
    }

    updateFPS(timestamp: number) {
        if (this.lastTime != null) {
            let timeTaken: number = timestamp - this.lastTime;
            this.fps = 1000 / timeTaken; // 1000 because 1000 milliseconds in a second
        }
        this.lastTime = timestamp
    }

    draw() {
        this.drawByLine();

        Engine.context.font = "14px Gill Sans MT";
        Engine.context.fillText(`FPS: ${this.fps.toFixed(2)}`, Engine.getWindowWidth() * 0.96, Engine.getWindowHeight() * 0.99);
    }

    drawObjectBounds(objectToDraw: GameObject) {
        let minGlobal: Vector = objectToDraw.toGlobalCoords(objectToDraw.minMax.min);
        let maxGlobal: Vector = objectToDraw.toGlobalCoords(objectToDraw.minMax.max);

        Engine.context.beginPath();

        Engine.context.moveTo(minGlobal.x, minGlobal.y)
        Engine.context.lineTo(maxGlobal.x, minGlobal.y)
        Engine.context.lineTo(maxGlobal.x, maxGlobal.y)
        Engine.context.lineTo(minGlobal.x, maxGlobal.y)

        Engine.context.closePath();
        this.setDrawModes("", "rgba(209, 49, 17, 0.45)"); //light red for object hitbox

        for (let drawable of objectToDraw.drawObjects) {
            let minObjGlobal: Vector = objectToDraw.toGlobalCoords(drawable.minMax.min);
            let maxObjGlobal: Vector = objectToDraw.toGlobalCoords(drawable.minMax.max);

            Engine.context.beginPath();

            Engine.context.moveTo(minObjGlobal.x, minObjGlobal.y)
            Engine.context.lineTo(maxObjGlobal.x, minObjGlobal.y)
            Engine.context.lineTo(maxObjGlobal.x, maxObjGlobal.y)
            Engine.context.lineTo(minObjGlobal.x, maxObjGlobal.y)

            Engine.context.closePath();
            this.setDrawModes("", "rgba(102, 225, 0, 0.45)"); //light green for individual hitboxes
        };
    }
}

export { DebugObject }