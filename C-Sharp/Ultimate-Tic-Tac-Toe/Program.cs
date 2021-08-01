using System;

using Ventillo;

using Ultimate_Tic_Tac_Toe.Game;

namespace Ultimate_Tic_Tac_Toe
{
    class Program
    {
        static Engine engine = new Engine(60);
        static TicTacToe game = new TicTacToe();
        static void Main(string[] args)
        {
            engine.SetGame(game);
            engine.Start();
        }
    }
}
