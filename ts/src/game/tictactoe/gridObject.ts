import { DrawObject, GameObject } from "../../engine/gameobjects/gameObject.js";
import { Vector } from "../../engine/utils/vector.js";

class GridObject extends GameObject {
    completed: boolean = false;
    active: boolean = true;
    winningPlayer: string = "";
    borderSize: number;
    drawType: string = "";
    naughtColour: string = "rgba(23,81,126,0.3)"
    crossColour: string = "rgba(139,0,0,0.3)"

    constructor(position: Vector) {
        super(position);
    }

    generateWinLine(position1: Vector, position2: Vector, direction: string): DrawObject {
        let drawPoints: Vector[] = [];
        switch (direction) {
            case "Vertical":
                drawPoints.push(this.toLocalCoords(new Vector(position1.x - this.borderSize, position1.y)))
                drawPoints.push(this.toLocalCoords(new Vector(position1.x + this.borderSize, position1.y)))
                drawPoints.push(this.toLocalCoords(new Vector(position2.x + this.borderSize, position2.y)))
                drawPoints.push(this.toLocalCoords(new Vector(position2.x - this.borderSize, position2.y)))
                break;
            case "Horizontal":
                drawPoints.push(this.toLocalCoords(new Vector(position1.x, position1.y - this.borderSize)))
                drawPoints.push(this.toLocalCoords(new Vector(position2.x, position2.y - this.borderSize)))
                drawPoints.push(this.toLocalCoords(new Vector(position2.x, position2.y + this.borderSize)))
                drawPoints.push(this.toLocalCoords(new Vector(position1.x, position1.y + this.borderSize)))
                break;
            case "TopBottomDiagonal":
                drawPoints.push(this.toLocalCoords(new Vector(position1.x + this.borderSize, position1.y)))
                drawPoints.push(this.toLocalCoords(new Vector(position1.x, position1.y + this.borderSize)))
                drawPoints.push(this.toLocalCoords(new Vector(position2.x - this.borderSize, position2.y)))
                drawPoints.push(this.toLocalCoords(new Vector(position2.x, position2.y - this.borderSize)))
                break;
            case "BottomTopDiagonal":
                drawPoints.push(this.toLocalCoords(new Vector(position1.x + this.borderSize, position1.y)))
                drawPoints.push(this.toLocalCoords(new Vector(position2.x, position2.y + this.borderSize)))
                drawPoints.push(this.toLocalCoords(new Vector(position2.x, position2.y - this.borderSize)))
                drawPoints.push(this.toLocalCoords(new Vector(position1.x - this.borderSize, position1.y)))
                break;
        }

        return {
            drawPoints: drawPoints,
            fillColour: "#046827",
            strokeColour: "#eaeaea"
        }
    }

    checkWin(gridObjects: GridObject[][], playerType: string): boolean {
        for (let x = 0; x < 3; x++) {
            if (gridObjects[x][0].drawType == playerType &&
                gridObjects[x][1].drawType == playerType &&
                gridObjects[x][2].drawType == playerType) {

                this.drawObjects[0].fillColour = playerType == "Naught" ? this.naughtColour : this.crossColour;
                this.drawObjects.push(this.generateWinLine(gridObjects[x][0].position, gridObjects[x][2].position, "Vertical"))
                this.winningPlayer = playerType;
                this.drawType = playerType;
                return true;
            }
        }

        for (let y = 0; y < 3; y++) {
            if (gridObjects[0][y].drawType == playerType &&
                gridObjects[1][y].drawType == playerType &&
                gridObjects[2][y].drawType == playerType) {

                this.drawObjects[0].fillColour = playerType == "Naught" ? this.naughtColour : this.crossColour;
                this.drawObjects.push(this.generateWinLine(gridObjects[0][y].position, gridObjects[2][y].position, "Horizontal"))
                this.winningPlayer = playerType;
                this.drawType = playerType;
                return true;
            }
        }

        if (gridObjects[0][0].drawType == playerType &&
            gridObjects[1][1].drawType == playerType &&
            gridObjects[2][2].drawType == playerType) {

            this.drawObjects[0].fillColour = playerType == "Naught" ? this.naughtColour : this.crossColour;
            this.drawObjects.push(this.generateWinLine(gridObjects[0][0].position, gridObjects[2][2].position, "TopBottomDiagonal"))
            this.winningPlayer = playerType;
            this.drawType = playerType;
            return true;
        }

        if (gridObjects[0][2].drawType == playerType &&
            gridObjects[1][1].drawType == playerType &&
            gridObjects[2][0].drawType == playerType) {

            this.drawObjects[0].fillColour = playerType == "Naught" ? this.naughtColour : this.crossColour;
            this.drawObjects.push(this.generateWinLine(gridObjects[0][2].position, gridObjects[2][0].position, "BottomTopDiagonal"))
            this.winningPlayer = playerType;
            this.drawType = playerType;
            return true;
        }

        return false;
    }

    checkWinState(gridObjects: GridObject[][]): boolean {
        let won: boolean = false;

        if (!this.completed) {
            if (this.checkWin(gridObjects, "Naught") || this.checkWin(gridObjects, "Cross"))
                won = true;

            if (won) {
                this.completed = true;
                this.active = false
            }
            return won;
        }
    }

}

export { GridObject }