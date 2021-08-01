using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Ventillo;
using Ventillo.System;
using Ventillo.Interfaces;

namespace Ultimate_Tic_Tac_Toe.Game
{
    internal class TicTacToe : IGame
    {
        internal TicTacToe()
        {
            gameObjects.Add(new Grid(new Vector(Engine.playableArea.Max.x / 2, Engine.playableArea.Max.y / 2), gameObjects));
        }

        ~TicTacToe()
        {
            for (var gameObjectIndex = 0; gameObjectIndex < gameObjects.Count; gameObjectIndex++)
            {
                var gameObject = gameObjects.ElementAt(gameObjectIndex);

                DeleteGameObject(gameObject);
            }
        }
    }
}
