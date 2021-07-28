import { IGame } from "./interfaces/iGame.js"
import { DebugObject } from "./debug/debugObject.js";
import { Vector } from "./utils/vector.js"
import { MinMax } from "./gameobjects/minMax.js";

interface CoRoutine {
    type: string,
    fn: Generator
}

class Engine {
    static keys: string[] = [];
    static mouseClickPositions: Vector[] = [];
    static fps: number = 0;
    static coRoutines: CoRoutine[] = [];
    static context: CanvasRenderingContext2D
    static canvas: HTMLCanvasElement;
    static playableArea: MinMax;
    static scenes: IGame[] = [];
    debug: boolean = false;
    runGame: boolean = true;
    frameId: number = 0;
    debugObject: DebugObject;
    game: IGame;

    constructor() {
        this.setupCanvas();
        this.setupEvents();
        this.debugObject = new DebugObject(new Vector(0, 0), Engine.playableArea);
    }

    setGame(game: IGame) {
        this.runGame = true;

        this.game = game;
    }

    start() {
        console.log("Engine started!")

        this.startInternalCoRoutine(this.checkForNextScene());
        this.startInternalCoRoutine(this.checkForUndefinedObjects());

        this.gameLoop(0);
    }

    stop() {
        window.cancelAnimationFrame(this.frameId);

        this.runGame = false;

        for (let coRoutine of Engine.coRoutines)
            if (coRoutine.type == "Game")
                Engine.coRoutines.removeElement(coRoutine);

        Engine.keys = [];

        this.game.destructor();
        this.game = undefined;
    }

    static switchScene(game: IGame) {
        Engine.scenes.push(game);
    }

    startInternalCoRoutine(coRoutine: Generator) {
        Engine.coRoutines.push({ type: "Engine", fn: coRoutine });
    }

    static startCoRoutine(coRoutine: Generator) {
        Engine.coRoutines.push({ type: "Game", fn: coRoutine });
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

    static *waitForSeconds(seconds: number): Generator {
        let secsInMilli = seconds * 1000;
        let now = Date.now();

        while (Date.now() - now < secsInMilli)
            yield null;

        yield null;

    }

    *checkForNextScene(): Generator {
        while (true) {
            if (Engine.scenes.length > 0) {
                stop();
                this.setGame(Engine.scenes.last());
                Engine.scenes.removeElement(Engine.scenes.last());
            }
            yield null;
        }
    }

    *checkForUndefinedObjects(): Generator {
        while (true) {
            for (let gameObject of this.game.gameObjects)
                if (gameObject == undefined)
                    this.game.gameObjects.removeElement(gameObject);
            yield null;
        }
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

        Engine.keys = [];
        Engine.mouseClickPositions = [];
    }

    executeCoRoutines() {
        for (let coRoutine of Engine.coRoutines)
            if (coRoutine.fn.next().done)
                Engine.coRoutines.removeElement(coRoutine)
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
                    Engine.keys.removeElement(key); //delete the key from the list, so other things can't use it's value. Stops two things from using one press
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
        window.addEventListener("mousedown", (e) => {
            Engine.mouseClickPositions.push(new Vector(e.pageX, e.pageY));
        })
    }

    setupCanvas() {
        Engine.canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
        Engine.canvas.width = Engine.getWindowWidth();
        Engine.canvas.height = Engine.getWindowHeight();

        Engine.context = Engine.canvas.getContext("2d");

        Engine.playableArea = new MinMax(
            new Vector(Engine.getWindowWidth() * 0.15, Engine.getWindowHeight() * 0.10),
            new Vector(Engine.getWindowWidth() * 0.85, Engine.getWindowHeight() * 0.90)
        )

        this.clearScreen();
    }

    clearScreen() {
        Engine.context.clearRect(0, 0, Engine.canvas.width, Engine.canvas.height);
        Engine.context.fillStyle = "#000000";
        Engine.context.fillRect(0, 0, Engine.canvas.width, Engine.canvas.height);
    };
}

export { Engine }