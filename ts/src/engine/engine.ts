import { IGame } from "../interfaces/iGame.js";
import { DebugObject } from "./debugObject.js";
import { Vector } from "./vector.js"
import { Utilities } from "./utilities.js"
import { GameObject } from "./gameObject.js";

interface minMax {
    min: Vector,
    max: Vector
}

class Engine {
    static keys: string[] = [];
    debug: boolean = false;
    runGame: boolean = true;
    frameId: number = 0;
    static fps: number = 0;
    static coRoutines: Generator[] = [];
    debugObject: DebugObject;
    game: IGame;
    static context: CanvasRenderingContext2D
    static canvas: HTMLCanvasElement;
    static playableArea: minMax;

    constructor() {
        this.setupCanvas();
        this.setupEvents();
        this.debugObject = new DebugObject(0, 0, Engine.playableArea);
    }

    setGame(game: IGame) {
        this.runGame = true;

        this.game = game;
    }

    start() {
        console.log("Engine started!")
        this.gameLoop(0);
    }

    stop() {
        window.cancelAnimationFrame(this.frameId);

        this.runGame = false;
        Engine.coRoutines = [];
        Engine.keys = [];

        this.game.destructor();
        this.game = undefined;
    }

    static startCoRoutine(coRoutine: Generator) {
        Engine.coRoutines.push(coRoutine);
    }

    static getWindowWidth() {
        return window.innerWidth - 25;
    };

    static getWindowHeight() {
        return window.innerHeight - 25;
    };

    static setGlobalAlpha(value: number) {
        Engine.context.save();
        Engine.context.globalAlpha = value;
    }

    static restoreGlobalAlpha() {
        Engine.context.restore();
    }

    draw() {
        this.clearScreen();
        this.game.draw();
        this.drawDebug();
    }

    drawDebug() {
        if (this.debug) {
            for (let gameObject of this.game.gameObjects)
                this.debugObject.drawObjectBounds(gameObject)
            this.debugObject.draw();
        }
    }

    update(timestamp: number) {
        this.game.update();

        this.checkDebug();

        this.debugObject.updateFPS(timestamp);

        Engine.fps = this.debugObject.getFPS();

        Engine.keys = [];
    }

    executeCoRoutines() {
        for (let coRoutine of Engine.coRoutines)
            if (coRoutine.next().done)
                Utilities.removeElement(Engine.coRoutines, coRoutine)
    }

    gameLoop(timestamp: number) { //This is passed in by requestAnimationFrame. Is the time when the frame was called in relation to the start of the execution of the game in milliseconds
        if (this.runGame) {
            this.update(timestamp);

            this.executeCoRoutines();

            this.draw();

            this.frameId = window.requestAnimationFrame(this.gameLoop.bind(this));
        }
    }

    checkDebug() {
        for (let key of Engine.keys)
            switch (key) {
                case "q":
                    this.debug = !this.debug; //toggle debug mode
                    Utilities.removeElement(Engine.keys, key); //delete the key from the list, so other things can't use it's value. Stops two things from using one press
                    break;
            }
    }

    setupEvents() {
        window.addEventListener("keydown", (e) => {
            Engine.keys.push(e.key);
        })
        window.addEventListener("resize", () => {
            this.setupCanvas();
        })
    }

    setupCanvas() {
        Engine.canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
        Engine.canvas.width = Engine.getWindowWidth();
        Engine.canvas.height = Engine.getWindowHeight();

        Engine.context = Engine.canvas.getContext("2d");

        Engine.playableArea = {
            min: new Vector(Engine.getWindowWidth() * 0.15, Engine.getWindowHeight() * 0.10),
            max: new Vector(Engine.getWindowWidth() * 0.85, Engine.getWindowHeight() * 0.90)
        }

        this.clearScreen();
    }


    clearScreen() {
        Engine.context.clearRect(0, 0, Engine.canvas.width, Engine.canvas.height);
        Engine.context.fillStyle = "#000000";
        Engine.context.fillRect(0, 0, Engine.canvas.width, Engine.canvas.height);
    };
}

export { Engine, minMax }