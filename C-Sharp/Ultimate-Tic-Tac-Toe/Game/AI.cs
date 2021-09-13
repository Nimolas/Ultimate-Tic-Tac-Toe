using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Ventillo;

namespace Ultimate_Tic_Tac_Toe.Game
{
    struct AINode
    {
        int x;
        int y;
        string drawType;
    }

    struct AICell
    {
        int x;
        int y;
        bool active;
        bool completed;
        string drawType;
        List<List<AINode>> nodes;
    }

    struct AIGrid
    {
        List<List<AICell>> cells;
    }

    struct DecisionNode
    {
        public AIGrid grid;
        public int winWeight;
        public int winDepth;
        public List<DecisionNode>? futureMoves;
        public int cellX;
        public int cellY;
        public int nodeX;
        public int nodeY;

        public DecisionNode(AIGrid grid, int winWeight, int winDepth, List<DecisionNode>? futureMoves, int cellX, int cellY, int nodeX, int nodeY)
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

        IEnumerator Start(Grid gridState, TicTacToe game
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
    }
}
