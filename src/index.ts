import {Engine} from "@babylonjs/core/Engines/engine";
import {Scene} from "@babylonjs/core/scene";
import MainScene from "./scenes/mainScene";
import {Vector3} from "@babylonjs/core/Maths/math.vector";
import {Color4, Effect, PostProcess, UniversalCamera} from "@babylonjs/core";
import {AdvancedDynamicTexture, Button, Control, Image, Rectangle, TextBlock} from "@babylonjs/gui";

enum State { START = 0, GAME = 1, LOSE = 2, CUTSCENE = 3 }

class App {
    private canvas: HTMLCanvasElement;
    private engine: Engine;
    private scene: Scene;

    private state: State = State.START;

    private isTransition = false;

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
            switch (this.state) {
                case State.START:
                    this.scene.render();
                    break;
                // case State.CUTSCENE:
                //     this.scene.render();
                //     break;
                case State.GAME:
                    //if 30seconds have have passed, go back to start
                    // if (this.ui.time >= 30) {
                    //     this.goToStart();
                    //     this.ui.stopTimer();
                    // }
                    // if (this.ui.quit) {
                    //     this.goToStart();
                    //     this.ui.quit = false;
                    // }
                    this.scene.render();
                    break;
                // case State.LOSE:
                //     this._scene.render();
                //     break;
                default: break;
            }
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
        const scene = new Scene(this.engine);
        scene.clearColor = new Color4(0, 0, 0, 1);
        //creates and positions a free camera
        const camera = new UniversalCamera("camera1", new Vector3(0, 0, 0), scene);
        camera.setTarget(Vector3.Zero()); //targets the camera to scene origin

        //--GUI--
        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        guiMenu.idealHeight = 720;

        //background image
        const imageRect = new Rectangle("titleContainer");
        imageRect.width = 0.8;
        imageRect.height = 0.8;
        imageRect.thickness = 3;
        guiMenu.addControl(imageRect);

        const startbg = new Image("startbg", "/public/sprites/labyrinth.jpg");
        imageRect.addControl(startbg);

        const title = new TextBlock("title", "LOST AND FOUND");
        title.resizeToFit = true;
        title.fontFamily = "Ceviche One";
        title.fontSize = "64px";
        title.color = "white";
        title.resizeToFit = true;
        title.top = "14px";
        title.width = 0.8;
        title.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        imageRect.addControl(title);

        const startBtn = Button.CreateSimpleButton("start", "ENTER");
        startBtn.fontFamily = "Viga";
        startBtn.width = 0.2;
        startBtn.height = 0.1;
        startBtn.color = "white";
        startBtn.thickness = 2;
        startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        startBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        imageRect.addControl(startBtn);


        //set up transition effect : modified version of https://www.babylonjs-playground.com/#2FGYE8#0
        Effect.RegisterShader("fade",
            "precision highp float;" +
            "varying vec2 vUV;" +
            "uniform sampler2D textureSampler; " +
            "uniform float fadeLevel; " +
            "void main(void){" +
            "vec4 baseColor = texture2D(textureSampler, vUV) * fadeLevel;" +
            "baseColor.a = 1.0;" +
            "gl_FragColor = baseColor;" +
            "}");

        let fadeLevel = 1.0;
        this.isTransition = false;
        scene.registerBeforeRender(() => {
            if (this.isTransition) {
                fadeLevel -= .05;
                if (fadeLevel <= 0) {
                    this.goToGame();
                    this.isTransition = false;
                }
            }
        })

        //this handles interactions with the start button attached to the scene
        startBtn.onPointerDownObservable.add(() => {
            //fade screen
            const postProcess = new PostProcess("Fade", "fade", ["fadeLevel"], null, 1.0, camera);
            postProcess.onApply = (effect) => {
                effect.setFloat("fadeLevel", fadeLevel);
            };
            this.isTransition = true;

            scene.detachControl(); //observables disabled
        });

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
        
        const scene = MainScene.build(this.engine, this.canvas);

        await scene.whenReadyAsync();
        this.engine.hideLoadingUI(); //when the scene is ready, hide loading
        //lastly set the current state to the start state and set the scene to the start scene
        this.scene.dispose();
        this.scene = scene;
        this.state = State.GAME;
    }
}

new App();