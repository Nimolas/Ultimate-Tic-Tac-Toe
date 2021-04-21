import { Engine } from "../../engine/engine.js";
import { IGame } from "../../engine/interfaces/iGame.js";
import { PickedNode } from "./cell.js";
import { Grid } from "./grid.js";
import { TicTacToe } from "./tictactoe.js";

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
    winDepth: number;
    futureMoves?: DecisionNode[];
    cellX: number;
    cellY: number;
    nodeX: number;
    nodeY: number;
}

class AI {
    decisions: DecisionNode;
    playerType: string = "";
    aiTurn: boolean = false;

    constructor(playerType: string) {
        this.playerType = playerType;
    }

    timeCalculatingMoves(playerType: string, maxMoves: number, gridState: AIGrid = this.createNewAIGrid()): DecisionNode[] {

        console.time("AI calculating moves")
        let moves = this.calculateMoves(playerType, 0, maxMoves, gridState)
        console.timeEnd("AI calculating moves")
        console.log(moves);

        return moves;
    }

    *start(gridState: Grid, game: TicTacToe): Generator {
        this.decisions = {
            grid: this.createNewAIGrid(),
            winWeight: 0,
            winDepth: 0,
            futureMoves: [],
            cellX: 0,
            cellY: 0,
            nodeX: 0,
            nodeY: 0
        }

        while (this.compareGridStates(gridState, this.decisions))
            yield null;

        this.decisions.futureMoves = this.timeCalculatingMoves("Naught", 6, this.convertGridToAIGrid(gridState));

        while (!(game.gameObjects.last() as Grid).completed) {
            if (this.aiTurn) {

                let waitGen = Engine.waitForSeconds(Number.getRandomInt(1, 3));

                while (!waitGen.next().done)
                    yield null;

                let found: boolean = false;
                let count: number = 0;
                let playerMove: DecisionNode;

                while (!found && count < this.decisions.futureMoves.length) {
                    if (this.compareGridStates(gridState, this.decisions.futureMoves[count])) {
                        found = true;
                        playerMove = this.decisions.futureMoves[count]
                        this.decisions.futureMoves.empty();
                    }
                    count++;
                }

                if (!found)
                    throw new Error("Could not find the current board state in the AI's calculated moves")

                if (playerMove.futureMoves.length == 0) {
                    playerMove.futureMoves = this.timeCalculatingMoves(this.playerType, 5, playerMove.grid);
                }

                playerMove.futureMoves.sort((a, b) => a.winDepth - b.winDepth);
                let newFutureMoves = playerMove.futureMoves.filter(futureMove => futureMove.winDepth == playerMove.futureMoves[0].winDepth);

                newFutureMoves.sort(futureMove => futureMove.winWeight); //Sort the futuremoves list to move the highest winning moveset to 0 index

                let sameWeightDecisions: DecisionNode[] = newFutureMoves.filter(futureMove => futureMove.winWeight == playerMove.futureMoves[0].winWeight)

                let index = Number.getRandomInt(0, sameWeightDecisions.length - 1)
                this.decisions = sameWeightDecisions[index]

                if (this.decisions.futureMoves.length == 0) {
                    this.decisions.futureMoves = this.timeCalculatingMoves(this.playerType == "Naught" ? "Cross" : "Naught", 5, this.decisions.grid);
                }

                this.applyAIMoveToGrid(gridState);

                let cellX = this.decisions.cellX;
                let cellY = this.decisions.cellY;
                let nodeX = this.decisions.nodeX;
                let nodeY = this.decisions.nodeY;

                this.playerType == "Cross" ?
                    gridState.cells[cellX][cellY].nodes[nodeX][nodeY].setDrawObjectAI("Cross") :
                    gridState.cells[cellX][cellY].nodes[nodeX][nodeY].setDrawObjectAI("Naught");

                gridState.checkWinCondition();
                gridState.currentActivePlayer = this.playerType == "Naught" ? "Cross" : "Naught";

                this.aiTurn = false;
                game.aiActive = false;
            }
            yield null;
        }
    }

    update(): void {
        this.aiTurn = true;
    }

    applyAIMoveToGrid(gridState: Grid) {
        for (let cellX = 0; cellX < 3; cellX++) {
            for (let cellY = 0; cellY < 3; cellY++) {
                gridState.cells[cellX][cellY].active = this.decisions.grid.cells[cellX][cellY].active
                gridState.cells[cellX][cellY].drawType = this.decisions.grid.cells[cellX][cellY].drawType

                for (let nodeX = 0; nodeX < 3; nodeX++) {
                    for (let nodeY = 0; nodeY < 3; nodeY++) {
                        gridState.cells[cellX][cellY].nodes[nodeX][nodeY].drawType = this.decisions.grid.cells[cellX][cellY].nodes[nodeX][nodeY].drawType
                    }
                }
            }
        }

    }

    compareGridStates(gridState: Grid, move: DecisionNode): boolean {
        let similarNodes: number = 0;

        for (let cellX = 0; cellX < 3; cellX++) {
            for (let cellY = 0; cellY < 3; cellY++) {
                if (gridState.cells[cellX][cellY].active == move.grid.cells[cellX][cellY].active &&
                    gridState.cells[cellX][cellY].completed == move.grid.cells[cellX][cellY].completed &&
                    gridState.cells[cellX][cellY].drawType == move.grid.cells[cellX][cellY].drawType)


                    for (let nodeX = 0; nodeX < 3; nodeX++) {
                        for (let nodeY = 0; nodeY < 3; nodeY++) {
                            if (gridState.cells[cellX][cellY].nodes[nodeX][nodeY].drawType == move.grid.cells[cellX][cellY].nodes[nodeX][nodeY].drawType)
                                similarNodes++;
                        }
                    }
            }
        }

        return similarNodes == 81 ? true : false; //9 cells each with 9 nodes within = 81 nodes
    }

    convertGridToAIGrid(gridState: Grid): AIGrid {
        let grid: AIGrid = { cells: [] }

        for (let x = 0; x < 3; x++) {
            grid.cells.push([]);
            for (let y = 0; y < 3; y++) {
                grid.cells[x][y] = {
                    active: gridState.cells[x][y].active,
                    completed: gridState.cells[x][y].completed,
                    drawType: gridState.cells[x][y].drawType,
                    x: x,
                    y: y,
                    nodes: []
                }

                for (let xNode = 0; xNode < 3; xNode++) {
                    grid.cells[x][y].nodes.push([]);
                    for (let yNode = 0; yNode < 3; yNode++) {
                        grid.cells[x][y].nodes[xNode][yNode] = {
                            drawType: gridState.cells[x][y].nodes[xNode][yNode].drawType,
                            x: xNode,
                            y: yNode,
                        }
                    }
                }
            }
        }

        return grid;
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

                            decisions.push({
                                grid: this.copyBoardState(gridCopy),
                                winWeight: 0,
                                winDepth: 0,
                                cellX: activeCell.xNode,
                                cellY: activeCell.yNode,
                                nodeX: x,
                                nodeY: y
                            })

                            if (this.checkWinGrid(gridCopy.cells, this.playerType)) {
                                decisions.last().grid = this.copyBoardState(gridCopy);
                                decisions.last().winWeight += 2;
                                decisions.last().winDepth += 1;
                                return decisions;
                            }
                            else if (this.checkWinGrid(gridCopy.cells, this.playerType == "Naught" ? "Cross" : this.playerType)) {
                                decisions.last().grid = this.copyBoardState(gridCopy);
                                decisions.last().winWeight -= 2;
                                return decisions;
                            }
                            else if (this.checkDraw(gridCopy.cells)) {
                                decisions.last().grid = this.copyBoardState(gridCopy);
                                decisions.last().winWeight += 1;
                                decisions.last().winDepth += 1;
                                return decisions;
                            }
                            else {
                                let newGrid: AIGrid = this.copyBoardState(gridCopy);
                                let playerMove: string = playerType == "Naught" ? "Cross" : "Naught";
                                decisions[decisions.length - 1].futureMoves = this.calculateMoves(playerMove, currentMoveDepth + 1, maxMoveDepth, newGrid);

                                if (decisions.last().futureMoves.some(futureMove => futureMove.winDepth > 0)) {
                                    let winningMoves: DecisionNode[] = decisions.last().futureMoves.filter(futureMove => futureMove.winDepth > 0);
                                    let quickestWin: number = winningMoves.reduce((a, b) => a.winDepth < b.winDepth ? a : b).winDepth;

                                    decisions.last().winDepth = quickestWin + 1;
                                }

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

    checkWinGrid(cellObjects: AICell[][], playerType: string): boolean {
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