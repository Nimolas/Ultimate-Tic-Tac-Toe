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
        List<List<Cell>> cells = new List<List<Cell>>();
        string currentActivePlayer = "Cross";
        int borderSize = 2;
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

                    var cellPos = new Vector((minX + maxX) / 2, (minY + maxX) / 2);

                    var boundary = new MinMax(new Vector(minX, minY), new Vector(maxX, maxY));

                    var cell = new Cell(cellPos, boundary, gameObjects);
                    gameObjects.Add(cell);
                    cells.ElementAt(xIndex).Add(cell);
                }
            }
            this.SetDrawObject(generateDrawObject(xThird, yThird));
        }

        List<DrawObject> generateDrawObject(double xThird, double yThird)
        {
            var firstBarPos = this.ToLocalCoords(
                new Vector(
                    Engine.playableArea.Min.x + xThird,
                    Engine.playableArea.Min.y + yThird
                )
            );

            var secondBarPos = this.ToLocalCoords(
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
                        new Vector(firstBarPos.x - this.borderSize, Engine.playableArea.Min.y - this.Position.y),
                        new Vector(firstBarPos.x + this.borderSize, Engine.playableArea.Min.y - this.Position.y),
                        new Vector(firstBarPos.x + this.borderSize, Engine.playableArea.Max.y - this.Position.y),
                        new Vector(firstBarPos.x - this.borderSize, Engine.playableArea.Max.y - this.Position.y),
                    },
                    new Color(109, 10, 208, 255),
                    new Color(234, 234, 234, 255)
                ),
                new DrawObject(
                    new List<Vector>
                    {
                        new Vector(secondBarPos.x - this.borderSize, Engine.playableArea.Min.y - this.Position.y),
                        new Vector(secondBarPos.x + this.borderSize, Engine.playableArea.Min.y - this.Position.y),
                        new Vector(secondBarPos.x + this.borderSize, Engine.playableArea.Max.y - this.Position.y),
                        new Vector(secondBarPos.x - this.borderSize, Engine.playableArea.Max.y - this.Position.y),
                    },
                    new Color(109, 10, 208, 255),
                    new Color(234, 234, 234, 255)
                ),
                new DrawObject(
                    new List<Vector>
                    {
                        new Vector(Engine.playableArea.Min.x - this.Position.x, firstBarPos.y - this.borderSize),
                        new Vector(Engine.playableArea.Max.x - this.Position.x, firstBarPos.y - this.borderSize),
                        new Vector(Engine.playableArea.Max.x - this.Position.x, firstBarPos.y + this.borderSize),
                        new Vector(Engine.playableArea.Min.x - this.Position.x, firstBarPos.y + this.borderSize),
                    },
                    new Color(109, 10, 208, 255),
                    new Color(234, 234, 234, 255)
                ),
                new DrawObject(
                    new List<Vector>
                    {
                new Vector(Engine.playableArea.Min.x - this.Position.x, secondBarPos.y - this.borderSize),
                new Vector(Engine.playableArea.Max.x - this.Position.x, secondBarPos.y - this.borderSize),
                new Vector(Engine.playableArea.Max.x - this.Position.x, secondBarPos.y + this.borderSize),
                new Vector(Engine.playableArea.Min.x - this.Position.x, secondBarPos.y + this.borderSize),
                    },
                    new Color(109, 10, 208, 255),
                    new Color(234, 234, 234, 255)
                ),
            };

            return drawobjects;
        }

        void swapActivePlayer()
        {
            if (currentActivePlayer == "Naught")
            {
                currentActivePlayer = "Cross";
            }
            else currentActivePlayer = "Naught";
        }

        void disableAllCells()
        {
            foreach (var cells in this.cells)
            {
                foreach (var cell in cells)
                {
                    cell.active = false;
                }
            }
        }

        void activateAllNonCompletedCells()
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

        bool setNodeForAI(int xCellIndex, int yCellIndex, int xNodeIndex, int yNodeIndex, string currentPlayer)
        {
            var result = cells.ElementAt(xCellIndex).ElementAt(yCellIndex).setDrawTypeForAI(xNodeIndex, yNodeIndex, currentPlayer);

            if (result.picked)
            {
                this.disableAllCells();
                if (!cells.ElementAt(result.nodeX).ElementAt(result.nodeY).completed)
                {
                    cells.ElementAt(result.nodeX).ElementAt(result.nodeY).active = true;
                }
                else this.activateAllNonCompletedCells();

                return true;
            }
            return false;
        }

        bool handleMouseEvents()
        {
            foreach (var mouseClick in Engine.mouseClickPositions)
            {
                if (Engine.playableArea.pointIntersects(mouseClick))
                {
                    foreach (var xCell in cells)
                    {
                        foreach (var yCell in xCell)
                        {
                            var result = yCell.handleMouseEvent(mouseClick, currentActivePlayer);

                            if (result.picked)
                            {
                                swapActivePlayer();
                                disableAllCells();

                                if (!cells.ElementAt(result.nodeX).ElementAt(result.nodeY).completed)
                                {
                                    cells.ElementAt(result.nodeX).ElementAt(result.nodeY).active = true;
                                }
                                else activateAllNonCompletedCells();

                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }

        void checkWinCondition()
        {
            for (var xIndex = 0; xIndex < 3; xIndex++)
            {
                for (var yIndex = 0; yIndex < 3; yIndex++)
                {
                    var cell = cells.ElementAt(xIndex).ElementAt(yIndex);

                    cell.checkWinState(cell.nodes);
                }
            }

            if (checkWinState(cells))
            {
                disableAllCells();
            }
        }

        bool update(bool aiActive)
        {
            if (!aiActive)
            {
                aiActive = handleMouseEvents() == true ? true : false;

                checkWinCondition();
            }

            return aiActive;
        }
    }
}
