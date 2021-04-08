import { Cell } from "./cell.js";
import { Grid } from "./grid.js";

interface DecisionNode {
    grid: Grid;
    winWeight: number;
    futureMoves?: DecisionNode[];
}

class AI {
    decisions: DecisionNode;
    playerType: string = "";

    constructor(playerType: string) {
        this.playerType = playerType;
        this.decisions = { grid: new Grid(true), winWeight: 0, futureMoves: this.calculateMoves(playerType) }
        console.log("AI Finished calculating move")
    }

    calculateMoves(playerType: string, gridState: Grid = new Grid(true)): DecisionNode[] {
        interface activeCells {
            xNode: number;
            yNode: number;
        }
        let activeCells: activeCells[] = [];
        let decisions: DecisionNode[] = [];

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if (gridState.cells[x][y].active == true) activeCells.push({ xNode: x, yNode: y })
            }
        }

        for (let activeCell of activeCells) {
            for (let x = 0; x < 3; x++) {
                for (let y = 0; y < 3; y++) {
                    let gridCopy = this.copyBoardState(gridState);

                    if (gridCopy.setNodeForAI(activeCell.xNode, activeCell.yNode, x, y, playerType)) {

                        decisions.push({ grid: this.copyBoardState(gridCopy), winWeight: 0 })

                        if (gridState.checkWin(true, gridCopy.cells, this.playerType)) {
                            decisions.last().grid = this.copyBoardState(gridCopy);
                            decisions.last().winWeight += 2;
                        }
                        else if (gridCopy.checkWin(true, gridCopy.cells, this.playerType == "Naught" ? "Cross" : this.playerType)) {
                            decisions.last().grid = this.copyBoardState(gridCopy);
                        }
                        else if (gridCopy.checkDraw(gridCopy.cells)) {
                            decisions.last().grid = this.copyBoardState(gridCopy);
                            decisions.last().winWeight += 1;
                        }
                        else {
                            let newGrid = this.copyBoardState(gridCopy);
                            let playerMove = playerType == "Naught" ? "Cross" : "Naught";
                            decisions[decisions.length - 1].futureMoves = this.calculateMoves(playerMove, newGrid);

                            for (let futureMove of decisions.last().futureMoves)
                                decisions.last().winWeight += futureMove.winWeight;
                        }
                    }
                }
            }
        }

        return decisions;
    }

    copyBoardState(gridState: Grid) {
        let newGrid = new Grid(true);

        for (let xCell = 0; xCell < 3; xCell++) {
            for (let yCell = 0; yCell < 3; yCell++) {
                newGrid.cells[xCell][yCell].drawType = gridState.cells[xCell][yCell].drawType;
                newGrid.cells[xCell][yCell].completed = gridState.cells[xCell][yCell].completed;
                newGrid.cells[xCell][yCell].active = gridState.cells[xCell][yCell].active;

                for (let xNode = 0; xNode < 3; xNode++) {
                    for (let yNode = 0; yNode < 3; yNode++) {
                        newGrid.cells[xCell][yCell].nodes[xNode][yNode].drawType = gridState.cells[xCell][yCell].nodes[xNode][yNode].drawType;
                    }
                }
            }
        }

        return newGrid;
    }
}

export { AI }