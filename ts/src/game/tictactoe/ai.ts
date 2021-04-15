import { PickedNode } from "./cell.js";
import { Grid } from "./grid.js";

interface AINode {
    x: number,
    y: number,
    drawType: string
}

interface AICell {
    x: number,
    y: number,
    active: boolean,
    completed: boolean,
    drawType: string,
    nodes: AINode[][],
}

interface AIGrid {
    cells: AICell[][]
}

interface DecisionNode {
    grid: AIGrid;
    winWeight: number;
    futureMoves?: DecisionNode[];
}

class AI {
    decisions: DecisionNode;
    playerType: string = "";

    constructor(playerType: string) {
        this.playerType = playerType;


        this.decisions = {
            grid: this.createNewAIGrid(),
            winWeight: 0,
            futureMoves: this.timeCalculatingMoves("Cross")
        }

    }

    timeCalculatingMoves(playerType: string): DecisionNode[] {
        let timeBefore = Date.now();

        console.log("AI calculating moves")
        let moves = this.calculateMoves(playerType, 0, 5)

        let timeDiff = Date.now() - timeBefore;

        console.log("AI Finished calculating moves")
        console.log(`Time Taken ${(timeDiff / 1000).toFixed(2)}`)
        console.log(this.decisions);

        return moves;
    }

    update(gridState: Grid) {
        let nextMove: DecisionNode;

        for (let move of this.decisions.futureMoves) {
            if (this.compareGridStates(gridState, move))
                console.log("Found move")
        }
        console.log("Didn't find move")
    }

    compareGridStates(gridState: Grid, move: DecisionNode): boolean {
        for (let cellX = 0; cellX < 3; cellX++) {
            for (let cellY = 0; cellY < 3; cellY++) {
                if (gridState.cells[cellX][cellY].active != move.grid.cells[cellX][cellY].active ||
                    gridState.cells[cellX][cellY].completed != move.grid.cells[cellX][cellY].completed ||
                    gridState.cells[cellX][cellY].drawType != move.grid.cells[cellX][cellY].drawType)
                    return false;

                for (let nodeX = 0; nodeX < 3; nodeX++) {
                    for (let nodeY = 0; nodeY < 3; nodeY++) {
                        if (gridState.cells[cellX][cellY].drawType != move.grid.cells[cellX][cellY].drawType)
                            return false;
                    }
                }
            }
        }

        return true;
    }

    createNewAIGrid(): AIGrid {
        let grid: AIGrid = { cells: [] }

        for (let x = 0; x < 3; x++) {
            grid.cells.push([]);
            for (let y = 0; y < 3; y++) {
                grid.cells[x][y] = {
                    active: true,
                    completed: false,
                    drawType: "",
                    x: x,
                    y: y,
                    nodes: []
                }

                for (let xNode = 0; xNode < 3; xNode++) {
                    grid.cells[x][y].nodes.push([]);
                    for (let yNode = 0; yNode < 3; yNode++) {
                        grid.cells[x][y].nodes[xNode][yNode] = {
                            drawType: "",
                            x: xNode,
                            y: yNode,
                        }
                    }
                }
            }
        }

        return grid;
    }

    calculateMoves(playerType: string, currentMoveDepth: number, maxMoveDepth: number, gridState: AIGrid = this.createNewAIGrid()): DecisionNode[] {
        interface activeCells {
            xNode: number;
            yNode: number;
        }
        let activeCells: activeCells[] = [];
        let decisions: DecisionNode[] = [];

        if (currentMoveDepth < maxMoveDepth) {
            for (let x = 0; x < 3; x++) {
                for (let y = 0; y < 3; y++) {
                    if (gridState.cells[x][y].active == true) activeCells.push({ xNode: x, yNode: y })
                }
            }

            for (let activeCell of activeCells) {
                for (let x = 0; x < 3; x++) {
                    for (let y = 0; y < 3; y++) {
                        let gridCopy = this.copyBoardState(gridState);

                        if (this.setNodeForAI(gridCopy, activeCell.xNode, activeCell.yNode, x, y, playerType)) {

                            decisions.push({ grid: this.copyBoardState(gridCopy), winWeight: 0 })

                            if (this.checkWinGrid(gridCopy, gridCopy.cells, playerType)) {
                                decisions.last().grid = this.copyBoardState(gridCopy);
                                decisions.last().winWeight += 2;
                                return decisions;
                            }
                            else if (this.checkWinGrid(gridCopy, gridCopy.cells, this.playerType == "Naught" ? "Cross" : this.playerType)) {
                                decisions.last().grid = this.copyBoardState(gridCopy);
                                return decisions;
                            }
                            else if (this.checkDraw(gridCopy.cells)) {
                                decisions.last().grid = this.copyBoardState(gridCopy);
                                decisions.last().winWeight += 1;
                                return decisions;
                            }
                            else {
                                let newGrid = this.copyBoardState(gridCopy);
                                let playerMove = playerType == "Naught" ? "Cross" : "Naught";
                                decisions[decisions.length - 1].futureMoves = this.calculateMoves(playerMove, currentMoveDepth + 1, maxMoveDepth, newGrid);

                                for (let futureMove of decisions.last().futureMoves)
                                    decisions.last().winWeight += futureMove.winWeight;
                            }
                        }
                    }
                }
            }
        }

        return decisions;
    }

    checkDraw(gridObjects: AICell[][]) {
        let completedCells: number = 0;

        for (let gridObject of gridObjects)
            for (let cell of gridObject)
                if (cell.completed) completedCells++;

        if (completedCells == 9)
            return true;
        return false;
    }

    setDrawType(node: AINode, currentActivePlayer: string): boolean {
        if (node.drawType == "") {
            node.drawType = currentActivePlayer;
            return true;
        }

        return false;
    }

    checkWinCell(cell: AICell, nodeObjects: AINode[][], playerType: string): boolean {
        for (let x = 0; x < 3; x++) {
            if (nodeObjects[x][0].drawType == playerType &&
                nodeObjects[x][1].drawType == playerType &&
                nodeObjects[x][2].drawType == playerType) {

                cell.drawType = playerType;
                return true;
            }
        }

        for (let y = 0; y < 3; y++) {
            if (nodeObjects[0][y].drawType == playerType &&
                nodeObjects[1][y].drawType == playerType &&
                nodeObjects[2][y].drawType == playerType) {

                cell.drawType = playerType;
                return true;
            }
        }

        if (nodeObjects[0][0].drawType == playerType &&
            nodeObjects[1][1].drawType == playerType &&
            nodeObjects[2][2].drawType == playerType) {

            cell.drawType = playerType;
            return true;
        }

        if (nodeObjects[0][2].drawType == playerType &&
            nodeObjects[1][1].drawType == playerType &&
            nodeObjects[2][0].drawType == playerType) {

            cell.drawType = playerType;
            return true;
        }

        return false;
    }

    checkWinGrid(cell: AIGrid, cellObjects: AICell[][], playerType: string): boolean {
        for (let x = 0; x < 3; x++) {
            if (cellObjects[x][0].drawType == playerType &&
                cellObjects[x][1].drawType == playerType &&
                cellObjects[x][2].drawType == playerType) {

                return true;
            }
        }

        for (let y = 0; y < 3; y++) {
            if (cellObjects[0][y].drawType == playerType &&
                cellObjects[1][y].drawType == playerType &&
                cellObjects[2][y].drawType == playerType) {

                return true;
            }
        }

        if (cellObjects[0][0].drawType == playerType &&
            cellObjects[1][1].drawType == playerType &&
            cellObjects[2][2].drawType == playerType) {

            return true;
        }

        if (cellObjects[0][2].drawType == playerType &&
            cellObjects[1][1].drawType == playerType &&
            cellObjects[2][0].drawType == playerType) {

            return true;
        }

        return false;
    }

    checkWinState(cell: AICell, nodeObjects: AINode[][]): boolean {
        let won: boolean = false;

        if (!cell.completed) {
            if (this.checkWinCell(cell, nodeObjects, "Naught") || this.checkWinCell(cell, nodeObjects, "Cross"))
                won = true;

            if (won) {
                cell.completed = true;
                cell.active = false
            }
        }

        return won;
    }

    setDrawTypeForAI(cell: AICell, nodes: AINode[][], xIndex: number, yIndex: number, currentActivePlayer: string) {
        let pickedNode: PickedNode = {
            nodeX: xIndex,
            nodeY: yIndex,
            picked: false
        };

        if (this.setDrawType(nodes[xIndex][yIndex], currentActivePlayer)) {
            this.checkWinState(cell, nodes);
            pickedNode.picked = true;
        }

        return pickedNode;
    }

    disableAllCells(aiCells: AICell[][]): void {
        for (let cells of aiCells)
            for (let cell of cells) {
                cell.active = false;
            }
    }

    activateAllNonCompletedCells(aiCells: AICell[][]): void {
        for (let cells of aiCells)
            for (let cell of cells) {
                if (!cell.completed)
                    cell.active = true;
            }
    }

    setNodeForAI(grid: AIGrid, xCellIndex: number, yCellIndex: number, xNodeIndex: number, yNodeIndex: number, currentPlayer: string): boolean {
        let result = this.setDrawTypeForAI(grid.cells[xCellIndex][yCellIndex], grid.cells[xCellIndex][yCellIndex].nodes, xNodeIndex, yNodeIndex, currentPlayer)

        if (result.picked) {
            this.disableAllCells(grid.cells);
            if (!grid.cells[result.nodeX][result.nodeY].completed)
                grid.cells[result.nodeX][result.nodeY].active = true;
            else
                this.activateAllNonCompletedCells(grid.cells);
            return true;
        }
        return false;
    }

    copyBoardState(gridState: AIGrid): AIGrid {
        let newGrid = this.createNewAIGrid();

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