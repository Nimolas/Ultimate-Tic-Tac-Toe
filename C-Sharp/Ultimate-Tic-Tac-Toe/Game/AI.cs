﻿using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Ventillo;

namespace Ultimate_Tic_Tac_Toe.Game
{
    internal class AINode
    {
        internal int x;
        internal int y;
        internal string drawType;

        internal AINode(int x, int y, string drawType)
        {
            this.x = x;
            this.y = y;
            this.drawType = drawType;
        }
    }

    internal class AICell
    {
        internal int x;
        internal int y;
        internal bool active;
        internal bool completed;
        internal string drawType;
        internal List<List<AINode>> nodes;

        internal AICell(int x, int y, bool active, bool completed, string drawType, List<List<AINode>> nodes)
        {
            this.x = x;
            this.y = y;
            this.active = active;
            this.completed = completed;
            this.drawType = drawType;
            this.nodes = nodes;
        }
    }

    internal class AIGrid
    {
        internal List<List<AICell>> cells;
    }

    class DecisionNode
    {
        internal string grid;
        internal int winWeight;
        internal int winDepth;
        internal List<DecisionNode>? futureMoves;
        internal int cellX;
        internal int cellY;
        internal int nodeX;
        internal int nodeY;

        internal DecisionNode()
        {

        }

        internal DecisionNode(string grid, int winWeight, int winDepth, List<DecisionNode>? futureMoves, int cellX, int cellY, int nodeX, int nodeY)
        {
            this.grid = grid;
            this.winWeight = winWeight;
            this.winDepth = winDepth;
            this.futureMoves = futureMoves;
            this.cellX = cellX;
            this.cellY = cellY;
            this.nodeX = nodeX;
            this.nodeY = nodeY;
        }
    }

    internal struct ActiveCell
    {
        internal int nodeX;
        internal int nodeY;

        internal ActiveCell(int nodeX, int nodeY)
        {
            this.nodeX = nodeX;
            this.nodeY = nodeY;
        }
    }

    class AI
    {
        ConcurrentDictionary<string, AIGrid> gridStates = new ConcurrentDictionary<string, AIGrid>();
        DecisionNode decisions;
        string playerType = "";
        bool aiTurn = false;

        internal AI(string playerType)
        {
            this.playerType = playerType;
        }

        internal IEnumerator Start(Grid gridState, TicTacToe game)
        {
            var rand = new Random();
            decisions = new DecisionNode(ConvertGridToString(CreateNewAIGrid()), 0, 0, new List<DecisionNode>(), 0, 0, 0, 0);

            while (CompareGridStates(gridState, decisions))
            {
                yield return null;
            }

            decisions.futureMoves.Add(new DecisionNode(ConvertGridToString(ConvertGridToAIGrid(gridState)), 0, 0, new List<DecisionNode>(), 0, 0, 0, 0));

            while (!gridState.completed)
            {
                if (aiTurn)
                {
                    Engine.logger.Info("Starting AI move");
                    yield return Engine.WaitForSeconds(rand.Next(1, 3));

                    var found = false;
                    var count = 0;
                    DecisionNode playerMove = new DecisionNode();

                    while (!found && count < decisions.futureMoves.Count)
                    {
                        if (CompareGridStates(gridState, decisions.futureMoves.ElementAt(count)))
                        {
                            found = true;
                            playerMove = decisions.futureMoves.ElementAt(count);
                            decisions.futureMoves.Clear();
                        }
                        count++;
                    }

                    if (!found)
                    {
                        var error = new Exception("Could not find the current board state in the AI's calculated moves");
                        Engine.logger.Error("Could not find the current board state in the AI's calculated moves", error, decisions.futureMoves);
                        throw error;
                    }

                    if (playerMove.futureMoves.Count == 0)
                    {
                        Engine.logger.Info("Calculating AI Moves");
                        playerMove.futureMoves = CalculateMoves(playerType, 0, 5, GetGridFromDictionary(playerMove.grid));
                        Engine.logger.Info("Finished Calculating AI Moves");
                    }

                    playerMove.futureMoves.Sort((a, b) => a.winDepth - b.winDepth);
                    var newFutureMoves = playerMove.futureMoves.FindAll(futureMove => futureMove.winDepth == playerMove.futureMoves.ElementAt(0).winDepth);

                    newFutureMoves.Sort((a, b) => a.winWeight.CompareTo(b.winWeight));

                    var sameWeightDecisions = newFutureMoves.FindAll(futureMove => futureMove.winWeight == playerMove.futureMoves.ElementAt(0).winWeight);

                    var index = rand.Next(0, sameWeightDecisions.Count - 1);
                    decisions = sameWeightDecisions.ElementAt(index);

                    if (decisions.futureMoves.Count == 0)
                    {
                        Engine.logger.Info("Calculating AI Moves");
                        decisions.futureMoves = CalculateMoves(playerType == "Naught" ? "Cross" : "Naught", 0, 5, GetGridFromDictionary(decisions.grid));
                        Engine.logger.Info("Finished Calculating AI Moves");
                    }

                    ApplyAIMoveToGrid(gridState);

                    var cellX = decisions.cellX;
                    var cellY = decisions.cellY;
                    var nodeX = decisions.nodeX;
                    var nodeY = decisions.nodeY;

                    if (playerType == "Cross")
                    {
                        gridState.GetGridCells().ElementAt(cellX).ElementAt(cellY).nodes.ElementAt(nodeX).ElementAt(nodeY).SetDrawObjectAI("Cross");
                    }
                    else
                    {
                        gridState.GetGridCells().ElementAt(cellX).ElementAt(cellY).nodes.ElementAt(nodeX).ElementAt(nodeY).SetDrawObjectAI("Naught");
                    }

                    gridState.CheckWinCondition();
                    gridState.SetCurrentPlayer(playerType == "Naught" ? "Cross" : "Naught");

                    aiTurn = false;
                    game.SetAIActive(false);

                    Engine.logger.Info("Finished AI move");
                }
                yield return null;
            }
        }

        internal void Update()
        {
            aiTurn = true;
        }

        void ApplyAIMoveToGrid(Grid gridState)
        {
            var grid = GetGridFromDictionary(decisions.grid);

            for (var cellX = 0; cellX < 3; cellX++)
            {
                for (var cellY = 0; cellY < 3; cellY++)
                {
                    var cell = gridState.GetGridCells().ElementAt(cellX).ElementAt(cellY);
                    cell.active = grid.cells.ElementAt(cellX).ElementAt(cellY).active;
                    cell.drawType = grid.cells.ElementAt(cellX).ElementAt(cellY).drawType;

                    for (var nodeX = 0; nodeX < 3; nodeX++)
                    {
                        for (var nodeY = 0; nodeY < 3; nodeY++)
                        {
                            var node = gridState.GetGridCells().ElementAt(cellX).ElementAt(cellY).GetCellNodes().ElementAt(nodeX).ElementAt(nodeY);
                            node.drawType = grid.cells.ElementAt(cellX).ElementAt(cellY).nodes.ElementAt(nodeX).ElementAt(nodeY).drawType;
                        }
                    }
                }
            }

            decisions.grid = ConvertGridToString(grid);
        }

        bool CompareGridStates(Grid gridState, DecisionNode move)
        {
            var similarNodes = 0;
            var grid = GetGridFromDictionary(move.grid);

            for (var cellX = 0; cellX < 3; cellX++)
            {
                for (var cellY = 0; cellY < 3; cellY++)
                {
                    var gridStateCell = gridState.GetGridCells().ElementAt(cellX).ElementAt(cellY);
                    var moveCell = grid.cells.ElementAt(cellX).ElementAt(cellY);

                    if (gridStateCell.active == moveCell.active &&
                        gridStateCell.completed == moveCell.completed &&
                        gridStateCell.drawType == moveCell.drawType)
                    {
                        for (var nodeX = 0; nodeX < 3; nodeX++)
                        {
                            for (var nodeY = 0; nodeY < 3; nodeY++)
                            {
                                var gridStateNode = gridState.GetGridCells().ElementAt(cellX).ElementAt(cellY).GetCellNodes().ElementAt(nodeX).ElementAt(nodeY);
                                var moveNode = grid.cells.ElementAt(cellX).ElementAt(cellY).nodes.ElementAt(nodeX).ElementAt(nodeY);

                                if (gridStateNode.drawType == moveNode.drawType)
                                {
                                    similarNodes++;
                                }
                            }
                        }
                    }
                }
            }

            return similarNodes == 81 ? true : false;
        }

        AIGrid ConvertGridToAIGrid(Grid gridState)
        {
            var grid = new AIGrid
            {
                cells = new List<List<AICell>>()
            };

            for (var cellX = 0; cellX < 3; cellX++)
            {
                grid.cells.Add(new List<AICell>());
                for (var cellY = 0; cellY < 3; cellY++)
                {
                    var gridStateCell = gridState.GetGridCells().ElementAt(cellX).ElementAt(cellY);
                    grid.cells.ElementAt(cellX).Add(new AICell(cellX, cellY, gridStateCell.active, gridState.completed, gridStateCell.drawType, new List<List<AINode>>()));

                    for (var nodeX = 0; nodeX < 3; nodeX++)
                    {
                        grid.cells.ElementAt(cellX).ElementAt(cellY).nodes.Add(new List<AINode>());
                        for (var nodeY = 0; nodeY < 3; nodeY++)
                        {
                            var gridStateNode = gridStateCell.GetCellNodes().ElementAt(nodeX).ElementAt(nodeY);

                            grid.cells.ElementAt(cellX).ElementAt(cellY).nodes.ElementAt(nodeX).Add(new AINode(nodeX, nodeY, gridStateNode.drawType));
                        }
                    }
                }
            }

            return grid;
        }

        AIGrid CreateNewAIGrid()
        {
            var grid = new AIGrid();
            grid.cells = new List<List<AICell>>();

            for (var cellX = 0; cellX < 3; cellX++)
            {
                grid.cells.Add(new List<AICell>());
                for (var cellY = 0; cellY < 3; cellY++)
                {
                    grid.cells.ElementAt(cellX).Add(new AICell(cellX, cellY, true, false, "", new List<List<AINode>>()));

                    for (var nodeX = 0; nodeX < 3; nodeX++)
                    {
                        grid.cells.ElementAt(cellX).ElementAt(cellY).nodes.Add(new List<AINode>());
                        for (var nodeY = 0; nodeY < 3; nodeY++)
                        {
                            grid.cells.ElementAt(cellX).ElementAt(cellY).nodes.ElementAt(nodeX).Add(new AINode(nodeX, nodeY, ""));
                        }
                    }
                }
            }

            return grid;
        }

        List<ActiveCell> CalculateActiveCells(AIGrid gridState)
        {
            var activeCells = new List<ActiveCell>();

            for (var cellX = 0; cellX < 3; cellX++)
            {
                for (var cellY = 0; cellY < 3; cellY++)
                {
                    if (gridState.cells.ElementAt(cellX).ElementAt(cellY).active == true)
                    {
                        activeCells.Add(new ActiveCell(cellX, cellY));
                    }
                }
            }

            return activeCells;
        }

        void AddGridToDictionary(string gridString, AIGrid gridState)
        {
            gridStates.TryAdd(gridString, gridState);
        }

        AIGrid GetGridFromDictionary(string gridString)
        {
            AIGrid grid;
            if (!gridStates.TryGetValue(gridString, out grid))
            {
                Engine.logger.Error("String searched with no associated grid");
                throw new Exception("Missing grid in dictionary");
            }
            return grid;
        }

        string ConvertGridToString(AIGrid grid)
        {
            var gridString = "";

            foreach (var cells in grid.cells)
            {
                foreach (var cell in cells)
                {
                    gridString += $"C,{cell.x},{cell.y},{cell.active},{cell.completed},{cell.drawType}|";

                    foreach (var nodes in cell.nodes)
                    {
                        foreach (var node in nodes)
                        {
                            gridString += $"N,{node.x},{node.y},{node.drawType}|";
                        }
                    }
                }
            }

            AddGridToDictionary(gridString, grid);
            return gridString;
        }

        List<DecisionNode> CalculateMoves(string currentPlayerType, int currentMoveDepth, int maxMoveDepth, AIGrid gridState)
        {
            var activeCells = new List<ActiveCell>();
            var decisions = new List<DecisionNode>();

            if (currentMoveDepth < maxMoveDepth)
            {
                activeCells = CalculateActiveCells(gridState);
                Parallel.ForEach(activeCells, activeCell =>
                {
                    var exit = false;

                    for (var x = 0; x < 3; x++)
                    {
                        for (var y = 0; y < 3; y++)
                        {
                            if (!exit)
                            {
                                var gridCopy = CopyBoardState(gridState);

                                if (SetNodeForAI(gridCopy, activeCell.nodeX, activeCell.nodeY, x, y, currentPlayerType))
                                {
                                    var gridString = ConvertGridToString(gridCopy);
                                    decisions.Add(new DecisionNode(
                                        gridString,
                                        0,
                                        0,
                                        new List<DecisionNode>(),
                                        activeCell.nodeX,
                                        activeCell.nodeY,
                                        x,
                                        y));

                                    if (CheckWinGrid(gridCopy.cells, currentPlayerType))
                                    {
                                        var lastDecision = decisions.Last();
                                        lastDecision.grid = gridString;
                                        lastDecision.winWeight += 2;
                                        lastDecision.winDepth += 1;
                                        decisions[decisions.Count - 1] = lastDecision;
                                        exit = true;
                                    }
                                    else if (CheckWinGrid(gridCopy.cells, this.playerType == "Naught" ? "Cross" : currentPlayerType))
                                    {
                                        var lastDecision = decisions.Last();
                                        lastDecision.grid = gridString;
                                        lastDecision.winWeight -= 2;
                                        decisions[decisions.Count - 1] = lastDecision;
                                        exit = true;
                                    }
                                    else if (CheckDraw(gridCopy.cells))
                                    {
                                        var lastDecision = decisions.Last();
                                        lastDecision.grid = gridString;
                                        lastDecision.winWeight += 1;
                                        lastDecision.winDepth += 1;
                                        decisions[decisions.Count - 1] = lastDecision;
                                        exit = true;
                                    }
                                    else
                                    {
                                        var newGrid = CopyBoardState(gridCopy);
                                        var playerMove = currentPlayerType == "Naught" ? "Cross" : "Naught";
                                        var lastDecision = decisions.Last();
                                        lastDecision.futureMoves = CalculateMoves(playerMove, currentMoveDepth + 1, maxMoveDepth, newGrid);

                                        if (lastDecision.futureMoves.Exists(futureMove => futureMove.winDepth > 0))
                                        {
                                            var winningMoves = lastDecision.futureMoves.FindAll(futureMove => futureMove.winDepth > 0);
                                            var quickestWin = winningMoves.OrderBy(futureMove => futureMove.winDepth).ToList()[0].winDepth;

                                            lastDecision.winDepth = quickestWin + 1;
                                        }

                                        foreach (var futureMove in lastDecision.futureMoves)
                                        {
                                            lastDecision.winWeight += futureMove.winWeight;
                                        }

                                        decisions[decisions.Count - 1] = lastDecision;
                                    }
                                }
                            }
                        }
                    }
                });
            }
            return decisions;
        }

        bool CheckDraw(List<List<AICell>> gridObjects)
        {
            var completedCells = 0;

            foreach (var gridObject in gridObjects)
            {
                foreach (var cell in gridObject)
                {
                    if (cell.completed) completedCells++;
                }
            }

            if (completedCells == 9) return true; else return false;
        }

        bool SetDrawType(AINode node, string currentActivePlayer)
        {
            if (node.drawType == "")
            {
                node.drawType = currentActivePlayer;
                return true;
            }
            return false;
        }

        bool CheckWinCell(AICell cell, List<List<AINode>> nodeObjects, string playerType)
        {
            for (var x = 0; x < 3; x++)
            {
                if (nodeObjects[x][0].drawType == playerType &&
                    nodeObjects[x][1].drawType == playerType &&
                    nodeObjects[x][2].drawType == playerType)
                {
                    cell.drawType = playerType;
                    return true;
                }
            }

            for (var y = 0; y < 3; y++)
            {
                if (nodeObjects[0][y].drawType == playerType &&
                    nodeObjects[1][y].drawType == playerType &&
                    nodeObjects[2][y].drawType == playerType)
                {
                    cell.drawType = playerType;
                    return true;
                }
            }

            if (nodeObjects[0][0].drawType == playerType &&
                nodeObjects[1][1].drawType == playerType &&
                nodeObjects[2][2].drawType == playerType)
            {
                cell.drawType = playerType;
                return true;
            }

            if (nodeObjects[0][2].drawType == playerType &&
                nodeObjects[1][1].drawType == playerType &&
                nodeObjects[2][0].drawType == playerType)
            {
                cell.drawType = playerType;
                return true;
            }

            return false;
        }

        bool CheckWinGrid(List<List<AICell>> cellObjects, string playerType)
        {
            for (var x = 0; x < 3; x++)
            {
                if (cellObjects[x][0].drawType == playerType &&
                    cellObjects[x][1].drawType == playerType &&
                    cellObjects[x][2].drawType == playerType)
                {
                    return true;
                }
            }

            for (var y = 0; y < 3; y++)
            {
                if (cellObjects[0][y].drawType == playerType &&
                    cellObjects[1][y].drawType == playerType &&
                    cellObjects[2][y].drawType == playerType)
                {
                    return true;
                }
            }

            if (cellObjects[0][0].drawType == playerType &&
                cellObjects[1][1].drawType == playerType &&
                cellObjects[2][2].drawType == playerType)
            {
                return true;
            }

            if (cellObjects[0][2].drawType == playerType &&
                cellObjects[1][1].drawType == playerType &&
                cellObjects[2][0].drawType == playerType)
            {
                return true;
            }

            return false;
        }

        bool CheckWinState(AICell cell, List<List<AINode>> nodeObjects)
        {
            if (!cell.completed)
            {
                if (CheckWinCell(cell, nodeObjects, "Naught") || CheckWinCell(cell, nodeObjects, "Cross"))
                {
                    cell.completed = true;
                    cell.active = false;
                    return true;
                }
            }
            return false;
        }

        PickedNode SetDrawTypeForAI(AICell cell, List<List<AINode>> nodes, int xIndex, int yIndex, string currentActivePlayer)
        {
            var pickedNode = new PickedNode(xIndex, yIndex, false);
            var node = nodes.ElementAt(xIndex).ElementAt(yIndex);

            if (SetDrawType(node, currentActivePlayer))
            {
                CheckWinState(cell, nodes);
                pickedNode.picked = true;
            }

            nodes[xIndex][yIndex] = node;
            return pickedNode;
        }

        void DisableAllCells(List<List<AICell>> aiCells)
        {
            for (var xIndex = 0; xIndex < 3; xIndex++)
            {
                for (var yIndex = 0; yIndex < 3; yIndex++)
                {
                    var cell = aiCells.ElementAt(xIndex).ElementAt(yIndex);
                    cell.active = false;
                }
            }
        }

        void ActivateAllNonCompletedCells(List<List<AICell>> aiCells)
        {
            for (var xIndex = 0; xIndex < 3; xIndex++)
            {
                for (var yIndex = 0; yIndex < 3; yIndex++)
                {
                    var cell = aiCells.ElementAt(xIndex).ElementAt(yIndex);
                    if (!cell.completed)
                    {
                        cell.active = true;
                    }
                }
            }
        }

        bool SetNodeForAI(AIGrid grid, int xCellIndex, int yCellIndex, int xNodeIndex, int yNodeIndex, string currentPlayer)
        {
            var cell = grid.cells.ElementAt(xCellIndex).ElementAt(yCellIndex);
            var result = SetDrawTypeForAI(cell, cell.nodes, xNodeIndex, yNodeIndex, currentPlayer);

            if (result.picked)
            {
                DisableAllCells(grid.cells);
                var pickedCell = grid.cells.ElementAt(result.nodeX).ElementAt(result.nodeY);
                if (!pickedCell.completed)
                {
                    pickedCell.active = true;
                }
                else
                    ActivateAllNonCompletedCells(grid.cells);
                return true;
            }
            return false;
        }

        AIGrid CopyBoardState(AIGrid gridState)
        {
            var newGrid = CreateNewAIGrid();

            for (var xCell = 0; xCell < 3; xCell++)
            {
                for (var yCell = 0; yCell < 3; yCell++)
                {
                    var newCell = newGrid.cells.ElementAt(xCell).ElementAt(yCell);
                    var gridStateCell = gridState.cells.ElementAt(xCell).ElementAt(yCell);

                    newCell.drawType = gridStateCell.drawType;
                    newCell.completed = gridStateCell.completed;
                    newCell.active = gridStateCell.active;

                    for (var xNode = 0; xNode < 3; xNode++)
                    {
                        for (var yNode = 0; yNode < 3; yNode++)
                        {
                            var newNode = newCell.nodes.ElementAt(xNode).ElementAt(yNode);
                            var gridStateNode = gridStateCell.nodes.ElementAt(xNode).ElementAt(yNode);

                            newNode.drawType = gridStateNode.drawType;
                        }
                    }
                }
            }

            return newGrid;
        }
    }
}
