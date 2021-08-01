using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Ventillo.System;
using Ventillo.GameObjects;

namespace Ultimate_Tic_Tac_Toe.Game
{
    internal class Cell : GridObject
    {
        internal Cell(Vector position, MinMax cellMinMax, List<GameObject> gameObjects) : base(position)
        {

        }
    }
}
