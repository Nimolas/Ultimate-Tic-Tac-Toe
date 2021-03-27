import { Engine } from "./src/engine/engine.js"
import { TicTacToe } from "./src/game/tictactoe.js";

let engine = new Engine();
engine.setGame(new TicTacToe());

engine.start();