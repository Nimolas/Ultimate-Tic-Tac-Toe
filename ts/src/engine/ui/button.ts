import { GameObject } from "../gameobjects/gameObject.js";
import { Vector } from "../utils/vector.js";
import { Engine } from "../engine.js";

interface EventFunction {
    fn: Function;
    params?: any[];
}

class Button extends GameObject {
    eventFunctions: EventFunction[] = [];

    constructor(position: Vector, dist: Vector, text: string, buttonColour: string, textColour: string) {
        super(position);

        this.setDrawObject([
            {
                drawPoints: [
                    new Vector(-(dist.x / 2), -(dist.y / 2)),
                    new Vector(dist.x / 2, -(dist.y / 2)),
                    new Vector(dist.x / 2, dist.y / 2),
                    new Vector(-(dist.x / 2), dist.y / 2),
                ],
                fillColour: buttonColour,
            },
            {
                drawPoints: [
                    new Vector(0, 0)
                ],
                strokeColour: textColour,
                text: text
            }])
    }

    addMouseEvent(fn: Function, args?: any[]): void {
        let newEventFunction: EventFunction = {
            fn: fn,
            params: args != undefined ? args : []
        }

        this.eventFunctions.push(newEventFunction);
    }

    handleMouseEvents(): void {
        for (let mouseEvent of Engine.getLastMouseClick())
            if (mouseEvent != undefined) {
                if (this.minMax.pointIntersects(this.toLocalCoords(mouseEvent))) {
                    for (let eventFunction of this.eventFunctions) {
                        eventFunction.fn(...eventFunction.params)
                    }
                }
            }
    }

    update(thing: any): any {
        this.handleMouseEvents();
    }

    draw() {
        this.drawByLine(this.drawObjects.slice(0, 1));
        this.drawByText(this.drawObjects.last().text, this.toGlobalCoords(this.drawObjects.last().drawPoints[0]), this.drawObjects.last().strokeColour, "40px")
    }
}

export { Button }