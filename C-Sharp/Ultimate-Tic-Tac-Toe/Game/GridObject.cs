using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Ventillo.System;
using Ventillo.GameObjects;

namespace Ultimate_Tic_Tac_Toe.Game
{
    class GridObject : GameObject
    {
        internal bool completed = false;
        internal bool active = true;
        internal string winningPlayer = "";
        internal int borderSize;
        internal string drawType = "";
        internal Color naughtColour = new Color(23, 81, 126, 77);
        internal Color crossColour = new Color(139, 0, 0, 77);
        internal GridObject(Vector position) : base(position)
        {
        }

        DrawObject GenerateWinLine(Vector position1, Vector position2, string direction)
        {
            var drawPoints = new List<Vector>();
            switch (direction)
            {
                case "Vertical":
                    drawPoints.Add(ToLocalCoords(new Vector(position1.x - this.borderSize, position1.y)));
                    drawPoints.Add(ToLocalCoords(new Vector(position1.x + this.borderSize, position1.y)));
                    drawPoints.Add(ToLocalCoords(new Vector(position2.x + this.borderSize, position2.y)));
                    drawPoints.Add(ToLocalCoords(new Vector(position2.x - this.borderSize, position2.y)));
                    break;
                case "Horizontal":
                    drawPoints.Add(ToLocalCoords(new Vector(position1.x, position1.y - this.borderSize)));
                    drawPoints.Add(ToLocalCoords(new Vector(position2.x, position2.y - this.borderSize)));
                    drawPoints.Add(ToLocalCoords(new Vector(position2.x, position2.y + this.borderSize)));
                    drawPoints.Add(ToLocalCoords(new Vector(position1.x, position1.y + this.borderSize)));
                    break;
                case "TopBottomDiagonal":
                    drawPoints.Add(ToLocalCoords(new Vector(position1.x + this.borderSize, position1.y)));
                    drawPoints.Add(ToLocalCoords(new Vector(position1.x, position1.y + this.borderSize)));
                    drawPoints.Add(ToLocalCoords(new Vector(position2.x - this.borderSize, position2.y)));
                    drawPoints.Add(ToLocalCoords(new Vector(position2.x, position2.y - this.borderSize)));
                    break;
                case "BottomTopDiagonal":
                    drawPoints.Add(ToLocalCoords(new Vector(position1.x + this.borderSize, position1.y)));
                    drawPoints.Add(ToLocalCoords(new Vector(position2.x, position2.y + this.borderSize)));
                    drawPoints.Add(ToLocalCoords(new Vector(position2.x, position2.y - this.borderSize)));
                    drawPoints.Add(ToLocalCoords(new Vector(position1.x - this.borderSize, position1.y)));
                    break;
            }

            return new DrawObject(
                drawPoints,
                new Color(4, 104, 39, 255),
                new Color(234, 234, 234, 255)
            );
        }

        bool CheckWin<T>(List<List<T>> gridObjects, string playerType) where T : GridObject
        {
            for (var x = 0; x < 3; x++)
            {
                if (gridObjects[x][0].drawType == playerType &&
                    gridObjects[x][1].drawType == playerType &&
                    gridObjects[x][2].drawType == playerType)
                {
                    var drawObject = this.DrawObjects.ElementAt(0);

                    drawObject.FillColour = playerType == "Naught" ? naughtColour : crossColour;
                    DrawObjects[0] = drawObject;

                    this.DrawObjects.Add(this.GenerateWinLine(gridObjects[x][0].Position, gridObjects[x][2].Position, "Vertical"));

                    this.winningPlayer = playerType;
                    this.drawType = playerType;
                    return true;
                }
            }

            for (var y = 0; y < 3; y++)
            {
                if (gridObjects[0][y].drawType == playerType &&
                    gridObjects[1][y].drawType == playerType &&
                    gridObjects[2][y].drawType == playerType)
                {
                    var drawObject = this.DrawObjects.ElementAt(0);

                    drawObject.FillColour = playerType == "Naught" ? naughtColour : crossColour;
                    DrawObjects[0] = drawObject;

                    this.DrawObjects.Add(this.GenerateWinLine(gridObjects[0][y].Position, gridObjects[2][y].Position, "Horizontal"));

                    this.winningPlayer = playerType;
                    this.drawType = playerType;
                    return true;
                }
            }

            if (gridObjects[0][0].drawType == playerType &&
                gridObjects[1][1].drawType == playerType &&
                gridObjects[2][2].drawType == playerType)
            {
                var drawObject = this.DrawObjects.ElementAt(0);

                drawObject.FillColour = playerType == "Naught" ? naughtColour : crossColour;
                DrawObjects[0] = drawObject;

                this.DrawObjects.Add(this.GenerateWinLine(gridObjects[0][0].Position, gridObjects[2][2].Position, "TopBottomDiagonal"));

                this.winningPlayer = playerType;
                this.drawType = playerType;
                return true;
            }

            if (gridObjects[0][2].drawType == playerType &&
                gridObjects[1][1].drawType == playerType &&
                gridObjects[2][0].drawType == playerType)
            {
                var drawObject = DrawObjects.ElementAt(0);

                drawObject.FillColour = playerType == "Naught" ? naughtColour : crossColour;
                DrawObjects[0] = drawObject;

                this.DrawObjects.Add(this.GenerateWinLine(gridObjects[0][2].Position, gridObjects[2][0].Position, "BottomTopDiagonal"));

                this.winningPlayer = playerType;
                this.drawType = playerType;
                return true;
            }

            return false;
        }

        bool CheckDraw(List<List<GridObject>> gridObjects)
        {
            var completedCells = 0;

            foreach (var gridObject in gridObjects)
                foreach (var cell in gridObject)
                    if (cell.completed) completedCells++;

            if (completedCells == 9)
                return true;
            return false;
        }

        internal bool CheckWinState<T>(List<List<T>> gridObjects) where T : GridObject
        {
            if (!completed)
            {
                if (CheckWin(gridObjects, "Naught") || CheckWin(gridObjects, "Cross"))
                {
                    completed = true;
                    active = false;
                    return true;
                }
            }
            return false;
        }
    }
}
