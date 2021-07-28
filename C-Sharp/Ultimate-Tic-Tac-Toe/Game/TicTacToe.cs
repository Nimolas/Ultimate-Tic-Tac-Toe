using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Ventillo.Interfaces;

namespace Ultimate_Tic_Tac_Toe.Game
{
    class TicTacToe : IGame
    {
        TicTacToe()
        {
            gameObjects.Add(new Grid());
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
