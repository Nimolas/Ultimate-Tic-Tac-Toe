using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Ventillo;
using Ventillo.System;
using Ventillo.GameObjects;

namespace Ultimate_Tic_Tac_Toe.Game
{
    class Grid : GridObject
    {
        List<List<Cell>> cells = new List<List<Cell>>();
        string currentActivePlayer = "Cross";
        int borderSize = 2;
        Grid(Vector position, List<GameObject> gameObjects) : base(position)
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
        }
    }
}
