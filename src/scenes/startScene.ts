import {Engine} from "@babylonjs/core/Engines/engine";
import {Scene} from "@babylonjs/core/scene";
import {Vector3} from "@babylonjs/core/Maths/math.vector";
import {Color4, Effect, PostProcess, UniversalCamera} from "@babylonjs/core";
import {AdvancedDynamicTexture, Button, Control, Image, Rectangle} from "@babylonjs/gui";

export default class StartScene {
    private static isTransition: boolean;
    private static input: string;

    static build(engine: Engine, canvas: HTMLCanvasElement, goToNextScene: (input: string) => Promise<void>): Scene {
        const scene = new Scene(engine);
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

        const startBtn1 = Button.CreateSimpleButton("start1", "WASD + Mouse");
        startBtn1.fontFamily = "Viga";
        startBtn1.width = 0.2;
        startBtn1.height = 0.1;
        startBtn1.color = "white";
        startBtn1.thickness = 2;
        startBtn1.top = "50px"
        startBtn1.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        startBtn1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        imageRect.addControl(startBtn1);

        const startBtn2 = Button.CreateSimpleButton("start2", "ZQSD + Mouse");
        startBtn2.fontFamily = "Viga";
        startBtn2.width = 0.2;
        startBtn2.height = 0.1;
        startBtn2.color = "white";
        startBtn2.thickness = 2;
        startBtn2.top = "120px"
        startBtn2.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        startBtn2.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        imageRect.addControl(startBtn2);

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
                    goToNextScene(this.input);
                    this.isTransition = false;
                }
            }
        })

        //this handles interactions with the start button attached to the scene
        startBtn1.onPointerDownObservable.add(() => {
            //fade screen
            const postProcess = new PostProcess("Fade", "fade", ["fadeLevel"], null, 1.0, camera);
            postProcess.onApply = (effect) => {
                effect.setFloat("fadeLevel", fadeLevel);
            };
            this.isTransition = true;
            this.input = "WASD";

            scene.detachControl(); //observables disabled
        });
        startBtn2.onPointerDownObservable.add(() => {
            //fade screen
            const postProcess = new PostProcess("Fade", "fade", ["fadeLevel"], null, 1.0, camera);
            postProcess.onApply = (effect) => {
                effect.setFloat("fadeLevel", fadeLevel);
            };
            this.isTransition = true;
            this.input = "ZQSD";

            scene.detachControl(); //observables disabled
        });

        return scene;
    }

}
