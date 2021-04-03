import { Engine } from "./src/engine/engine.js"
import { Menu } from "./src/game/menu/menu.js";

let engine: Engine = new Engine();
engine.setGame(new Menu());

engine.start();