using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Ventillo;

namespace Ultimate_Tic_Tac_Toe.Game
{
    internal struct AINode
    {
        internal int x;
        internal int y;
        internal string drawType;
    }

    internal struct AICell
    {
        internal int x;
        internal int y;
        internal bool active;
        internal bool completed;
        internal string drawType;
        internal List<List<AINode>> nodes;
    }

    internal struct AIGrid
    {
        internal List<List<AICell>> cells;
    }

    struct DecisionNode
    {
        internal AIGrid grid;
        internal int winWeight;
        internal int winDepth;
        internal List<DecisionNode>? futureMoves;
        internal int cellX;
        internal int cellY;
        internal int nodeX;
        internal int nodeY;

        internal DecisionNode(AIGrid grid, int winWeight, int winDepth, List<DecisionNode>? futureMoves, int cellX, int cellY, int nodeX, int nodeY)
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

    class AI
    {
        DecisionNode decisions;
        string playerType = "";
        bool aiTurn = false;

        AI(string playerType)
        {
            this.playerType = playerType;
        }

        IEnumerator Start(Grid gridState, TicTacToe game)
        {
            var rand = new Random();
            decisions = new DecisionNode(CreateNewAIGrid(), 0, 0, new List<DecisionNode>(), 0, 0, 0, 0);

            while (CompareGridStates(gridState, decisions))
            {
                yield return null;
            }

            decisions.futureMoves.Add(new DecisionNode(ConvertGridToAIGrid(), 0, 0, new List<DecisionNode>(), 0, 0, 0, 0));

            while (!(game.gameObjects.Last() as Grid).completed)
            {
                if (aiTurn)
                {
                    Engine.WaitForSeconds(rand.Next(1, 3));

                    var found = false;
                    var count = 0;
                    DecisionNode playerMove;

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
                        playerMove.futureMoves = CalculateMoves(playerType, 0, 5, playerMove.grid);
                    }

                    playerMove.futureMoves.Sort((a, b) => a.winDepth - b.winDepth);
                    var newFutureMoves = playerMove.futureMoves.FindAll(futureMove => futureMove.winDepth == playerMove.futureMoves.ElementAt(0).winDepth);

                    newFutureMoves.Sort((a, b) => a.winWeight.CompareTo(b.winWeight));

                    var sameWeightDecisions = newFutureMoves.FindAll(futureMove => futureMove.winWeight == playerMove.futureMoves.ElementAt(0).winWeight);

                    var index = rand.Next(0, sameWeightDecisions.Count - 1);
                    decisions = sameWeightDecisions.ElementAt(index);

                    if (decisions.futureMoves.Count == 0)
                    {
                        decisions.futureMoves = CalculateMoves(this.playerType == "Naught" ? "Cross" : "Naught", 5, decisions.grid);
                    }

                    ApplyAIMoveToGrid(gridState);

                    var cellX = decisions.cellX;
                    var cellY = decisions.cellY;
                    var nodeX = decisions.nodeX;
                    var nodeY = decisions.nodeY;

                    if (playerType == "Cross")
                    {
                        gridState.GetGridCells().ElementAt(cellX).ElementAt(cellY).nodes.ElementAt(nodeX).ElementAt(nodeY).setDrawObjectAI("Cross");
                    }
                    else
                    {
                        gridState.GetGridCells().ElementAt(cellX).ElementAt(cellY).nodes.ElementAt(nodeX).ElementAt(nodeY).setDrawObjectAI("Naught");
                    }

                    gridState.CheckWinCondition();
                    gridState.SetCurrentPlayer(playerType == "Naught" ? "Cross" : "Naught");

                    aiTurn = false;
                    game.SetAIActive(false);

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
            for (var cellX = 0; cellX < 3; cellX++)
            {
                for (var cellY = 0; cellY < 3; cellY++)
                {
                    var cell = gridState.GetGridCells().ElementAt(cellX).ElementAt(cellY);
                    cell.active = decisions.grid.cells.ElementAt(cellX).ElementAt(cellY).active;
                    cell.drawType = decisions.grid.cells.ElementAt(cellX).ElementAt(cellY).drawType;

                    for (var nodeX = 0; nodeX < 3; nodeX++)
                    {
                        for (var nodeY = 0; nodeY < 3; nodeY++)
                        {
                            var node = gridState.GetGridCells().ElementAt(cellX).ElementAt(cellY).GetCellNodes().ElementAt(nodeX).ElementAt(nodeY);
                            node.drawType = decisions.grid.cells.ElementAt(cellX).ElementAt(cellY).nodes.ElementAt(nodeX).ElementAt(nodeY).drawType;

                            gridState.GetGridCells()[cellX][cellY].GetCellNodes()[nodeX][nodeY] = node;
                        }
                    }

                    gridState.GetGridCells()[cellX][cellY] = cell;
                }
            }
        }

        bool CompareGridStates(Grid gridState, DecisionNode move)
        {
            var similarNodes = 0;

            for (var cellX = 0; cellX < 3; cellX++)
            {
                for (var cellY = 0; cellY < 3; cellY++)
                {
                    var gridStateCell = gridState.GetGridCells().ElementAt(cellX).ElementAt(cellY);
                    var moveCell = move.grid.cells.ElementAt(cellX).ElementAt(cellY);

                    if (gridStateCell.active == moveCell.active &&
                        gridStateCell.completed == moveCell.completed &&
                        gridStateCell.drawType == moveCell.drawType)
                    {
                        for (var nodeX = 0; nodeX < 3; nodeX++)
                        {
                            for (var nodeY = 0; nodeY < 3; nodeY++)
                            {
                                var gridStateNode = gridState.GetGridCells().ElementAt(cellX).ElementAt(cellY).GetCellNodes().ElementAt(nodeX).ElementAt(nodeY);
                                var moveNode = move.grid.cells.ElementAt(cellX).ElementAt(cellY).nodes.ElementAt(nodeX).ElementAt(nodeY);

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
    }
}
