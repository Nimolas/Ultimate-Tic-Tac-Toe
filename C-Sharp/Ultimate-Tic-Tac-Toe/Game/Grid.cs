﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Ventillo;
using Ventillo.System;
using Ventillo.GameObjects;

namespace Ultimate_Tic_Tac_Toe.Game
{
    internal class Grid : GridObject
    {
        protected List<List<Cell>> cells = new List<List<Cell>>();
        string currentActivePlayer = "Cross";
        internal Grid(Vector position, List<GameObject> gameObjects) : base(position)
        {
            var xThird = (Engine.playableArea.Max.x - Engine.playableArea.Min.x) / 3;
            var yThird = (Engine.playableArea.Max.y - Engine.playableArea.Min.y) / 3;

            var minX = Engine.playableArea.Min.x;
            var minY = Engine.playableArea.Min.y;

            for (var xIndex = 0; xIndex < 3; xIndex++)
            {
                this.cells.Add(new List<Cell>());
                if (xIndex > 0)
                {
                    minX += xThird;
                }
                else { minX = Engine.playableArea.Min.x; }

                var maxX = minX + xThird;

                for (var yIndex = 0; yIndex < 3; yIndex++)
                {
                    if (yIndex > 0)
                    {
                        minY += yThird;
                    }
                    else { minY = Engine.playableArea.Min.y; }

                    var maxY = minY + yThird;

                    var cellPos = new Vector(
                        (minX + maxX) / 2,
                        (minY + maxY) / 2
                    );

                    var boundary = new MinMax(
                        new Vector(minX, minY),
                        new Vector(maxX, maxY)
                    );

                    var cell = new Cell(cellPos, boundary, gameObjects);
                    gameObjects.Add(cell);
                    cells.ElementAt(xIndex).Add(cell);
                }
            }

            SetDrawObject(GenerateDrawObject(xThird, yThird));
        }

        internal List<List<Cell>> GetGridCells()
        {
            return cells;
        }

        internal void SetCurrentPlayer(string activePlayer)
        {
            currentActivePlayer = activePlayer;
        }

        List<DrawObject> GenerateDrawObject(double xThird, double yThird)
        {
            var firstBarPos = ToLocalCoords(
                new Vector(
                    Engine.playableArea.Min.x + xThird,
                    Engine.playableArea.Min.y + yThird
                )
            );

            var secondBarPos = ToLocalCoords(
                new Vector(
                    Engine.playableArea.Max.x - xThird,
                    Engine.playableArea.Max.y - yThird
                )
            );

            var drawobjects = new List<DrawObject>
            {
                new DrawObject(
                    new List<Vector>
                    {
                        new Vector(firstBarPos.x - borderSize, Engine.playableArea.Min.y - Position.y),
                        new Vector(firstBarPos.x + borderSize, Engine.playableArea.Min.y - Position.y),
                        new Vector(firstBarPos.x + borderSize, Engine.playableArea.Max.y - Position.y),
                        new Vector(firstBarPos.x - borderSize, Engine.playableArea.Max.y - Position.y),
                    },
                    new Color(109, 10, 208, 255),
                    new Color(234, 234, 234, 255)
                ),
                new DrawObject(
                    new List<Vector>
                    {
                        new Vector(secondBarPos.x - borderSize, Engine.playableArea.Min.y - Position.y),
                        new Vector(secondBarPos.x + borderSize, Engine.playableArea.Min.y - Position.y),
                        new Vector(secondBarPos.x + borderSize, Engine.playableArea.Max.y - Position.y),
                        new Vector(secondBarPos.x - borderSize, Engine.playableArea.Max.y - Position.y),
                    },
                    new Color(109, 10, 208, 255),
                    new Color(234, 234, 234, 255)
                ),
                new DrawObject(
                    new List<Vector>
                    {
                        new Vector(Engine.playableArea.Min.x - Position.x, firstBarPos.y - borderSize),
                        new Vector(Engine.playableArea.Max.x - Position.x, firstBarPos.y - borderSize),
                        new Vector(Engine.playableArea.Max.x - Position.x, firstBarPos.y + borderSize),
                        new Vector(Engine.playableArea.Min.x - Position.x, firstBarPos.y + borderSize),
                    },
                    new Color(109, 10, 208, 255),
                    new Color(234, 234, 234, 255)
                ),
                new DrawObject(
                    new List<Vector>
                    {
                new Vector(Engine.playableArea.Min.x - Position.x, secondBarPos.y - borderSize),
                new Vector(Engine.playableArea.Max.x - Position.x, secondBarPos.y - borderSize),
                new Vector(Engine.playableArea.Max.x - Position.x, secondBarPos.y + borderSize),
                new Vector(Engine.playableArea.Min.x - Position.x, secondBarPos.y + borderSize),
                    },
                    new Color(109, 10, 208, 255),
                    new Color(234, 234, 234, 255)
                ),
            };

            return drawobjects;
        }

        void SwapActivePlayer()
        {
            if (currentActivePlayer == "Naught")
            {
                currentActivePlayer = "Cross";
            }
            else currentActivePlayer = "Naught";
        }

        void DisableAllCells()
        {
            foreach (var cells in cells)
            {
                foreach (var cell in cells)
                {
                    cell.active = false;
                }
            }
        }

        void ActivateAllNonCompletedCells()
        {
            foreach (var cells in this.cells)
            {
                foreach (var cell in cells)
                {
                    if (!cell.completed)
                    {
                        cell.active = true;
                    }
                }
            }
        }

        //bool SetNodeForAI(int xCellIndex, int yCellIndex, int xNodeIndex, int yNodeIndex, string currentPlayer)
        //{
        //    var result = cells.ElementAt(xCellIndex).ElementAt(yCellIndex).SetDrawTypeForAI(xNodeIndex, yNodeIndex, currentPlayer);

        //    if (result.picked)
        //    {
        //        DisableAllCells();
        //        if (!cells.ElementAt(result.nodeX).ElementAt(result.nodeY).completed)
        //        {
        //            cells.ElementAt(result.nodeX).ElementAt(result.nodeY).active = true;
        //        }
        //        else ActivateAllNonCompletedCells();

        //        return true;
        //    }
        //    return false;
        //}

        bool HandleMouseEvents()
        {
            foreach (var mouseClick in Engine.mouseClickPositions)
            {
                if (Engine.playableArea.PointIntersects(mouseClick))
                {
                    foreach (var xCell in cells)
                    {
                        foreach (var yCell in xCell)
                        {
                            var result = yCell.HandleMouseEvents(mouseClick, currentActivePlayer);

                            if (result.picked)
                            {
                                SwapActivePlayer();
                                DisableAllCells();

                                if (!cells.ElementAt(result.nodeX).ElementAt(result.nodeY).completed)
                                {
                                    cells.ElementAt(result.nodeX).ElementAt(result.nodeY).active = true;
                                }
                                else
                                    ActivateAllNonCompletedCells();

                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }

        internal void CheckWinCondition()
        {
            for (var xIndex = 0; xIndex < 3; xIndex++)
            {
                for (var yIndex = 0; yIndex < 3; yIndex++)
                {
                    var cell = cells.ElementAt(xIndex).ElementAt(yIndex);

                    cell.CheckWinState(cell.nodes);
                }
            }

            if (CheckWinState(cells))
            {
                DisableAllCells();
            }
        }

        internal bool Update(bool aiActive)
        {
            if (!aiActive)
            {
                aiActive = HandleMouseEvents() == true ? true : false;

                CheckWinCondition();
            }

            return aiActive;
        }

        public override void Draw()
        {
            DrawByLine(DrawObjects);
        }
    }
}
