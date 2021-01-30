import {Engine} from "@babylonjs/core/Engines/engine";
import {Scene} from "@babylonjs/core/scene";
import MainScene from "./scenes/mainScene";
import StartScene from "./scenes/startScene";
import LoseScene from "./scenes/loseScene";
import WinScene from "./scenes/winScene";

enum State { START = 0, GAME = 1, LOSE = 2, WIN = 3 }

class App {
    private canvas: HTMLCanvasElement;
    private engine: Engine;
    private scene: Scene;

    private state: State = State.START;

    constructor() {
        this.canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
        this.engine = new Engine(this.canvas, true);
        this.scene = new Scene(this.engine);

        // manage key binding
        window.addEventListener("keydown", (ev: KeyboardEvent) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                console.log('Shift+Ctrl+Alt+I');
            }
        });

        this.main();
    }

    private async main(): Promise<void> {
        await this.goToStart();

        this.engine.runRenderLoop(() => {
            this.scene.render();
            // switch (this.state) {
            //     case State.START:
            //         this.scene.render();
            //         break;
            //     case State.GAME:
                    //if 30seconds have have passed, go back to start
                    // if (this.ui.time >= 30) {
                    //     this.goToStart();
                    //     this.ui.stopTimer();
                    // }
                    // if (this.ui.quit) {
                    //     this.goToStart();
                    //     this.ui.quit = false;
                    // }
            //         this.scene.render();
            //         break;
            //     case State.LOSE:
            //         this.scene.render();
            //         break;
            //     case State.LOSE:
            //         this.scene.render();
            //         break;
            //     default: break;
            // }
        });

        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }

    private async goToStart(): Promise<void> {
        this.engine.displayLoadingUI(); //make sure to wait for start to load
        //--SCENE SETUP--
        //dont detect any inputs from this ui while the game is loading
        this.scene.detachControl();

        const scene = StartScene.build(this.engine, this.canvas, () => this.goToGame());

        //--SCENE FINISHED LOADING--
        await scene.whenReadyAsync();
        this.engine.hideLoadingUI(); //when the scene is ready, hide loading
        //lastly set the current state to the start state and set the scene to the start scene
        this.scene.dispose();
        this.scene = scene;
        this.state = State.START;
    }

    private async goToGame(): Promise<void> {
        this.engine.displayLoadingUI();
        //--SCENE SETUP--
        //dont detect any inputs from this ui while the game is loading
        this.scene.detachControl();

        const scene = MainScene.build(this.engine, this.canvas, () => this.goToWin(), () => this.goToLose());

        //--SCENE FINISHED LOADING--
        await scene.whenReadyAsync();
        this.engine.hideLoadingUI(); //when the scene is ready, hide loading
        //lastly set the current state to the start state and set the scene to the start scene
        this.scene.dispose();
        this.scene = scene;
        this.state = State.GAME;
    }

    private async goToLose(): Promise<void> {
        this.engine.displayLoadingUI();
        //--SCENE SETUP--
        //dont detect any inputs from this ui while the game is loading
        this.scene.detachControl();

        const scene = LoseScene.build(this.engine, this.canvas, () => this.goToGame());

        //--SCENE FINISHED LOADING--
        await scene.whenReadyAsync();
        this.engine.hideLoadingUI(); //when the scene is ready, hide loading
        //lastly set the current state to the start state and set the scene to the start scene
        this.scene.dispose();
        this.scene = scene;
        this.state = State.LOSE;
    }

    private async goToWin(): Promise<void> {
        this.engine.displayLoadingUI();
        //--SCENE SETUP--
        //dont detect any inputs from this ui while the game is loading
        this.scene.detachControl();

        const scene = WinScene.build(this.engine, this.canvas, () => this.goToStart());

        //--SCENE FINISHED LOADING--
        await scene.whenReadyAsync();
        this.engine.hideLoadingUI(); //when the scene is ready, hide loading
        //lastly set the current state to the start state and set the scene to the start scene
        this.scene.dispose();
        this.scene = scene;
        this.state = State.WIN;
    }
}

new App();