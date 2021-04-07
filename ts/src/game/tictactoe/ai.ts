import { Cell } from "./cell.js";
import { Grid } from "./grid.js";

interface DecisionNode {
    grid: Grid;
    winWeight: number;
    futureMoves?: DecisionNode[];
}

class AI {
    decisions: DecisionNode[];
    playerType: string = "";

    constructor(playerType: string) {
        this.playerType = playerType;
        this.calculateMoves(playerType);
    }

    calculateMoves(playerType: string, gridState: Grid = new Grid(true)): DecisionNode[] {
        let activeCells: Cell[] = [];
        let decisions: DecisionNode[] = [];

        for (let xCells of gridState.cells)
            for (let yCell of xCells)
                if (yCell.active) activeCells.push(yCell);

        for (let activeCell of activeCells) {
            for (let x = 0; x < 3; x++) {
                for (let y = 0; y < 3; y++) {
                    decisions.push({ grid: new Grid(true), winWeight: 0 })
                    if (activeCell.setDrawTypeForAI(x, y, playerType).picked) {
                        if (gridState.checkWin(true, gridState.cells, this.playerType)) {
                            decisions.last().grid = this.copyBoardState(gridState);
                            decisions.last().winWeight += 2;
                        }
                        else if (gridState.checkDraw(gridState.cells)) {
                            decisions.last().grid = this.copyBoardState(gridState);
                            decisions.last().winWeight += 1;
                        } else if (gridState.checkWin(true, gridState.cells, this.playerType == "Naught" ? this.playerType : "Cross")) {
                            decisions.last().grid = this.copyBoardState(gridState);
                        } else {
                            let newGrid = this.copyBoardState(gridState);
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