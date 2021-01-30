import {Engine} from "@babylonjs/core/Engines/engine";
import {Scene} from "@babylonjs/core/scene";
import {Vector3} from "@babylonjs/core/Maths/math.vector";
import {Color4, Effect, PostProcess, UniversalCamera} from "@babylonjs/core";
import {AdvancedDynamicTexture, Button, Control, Rectangle, TextBlock} from "@babylonjs/gui";

export default class WinScene {
    private static isTransition: boolean;

    static build(engine: Engine, canvas: HTMLCanvasElement, goToNextScene: () => Promise<void>): Scene {
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

        const title = new TextBlock("title", "WIN");
        title.resizeToFit = true;
        title.fontFamily = "Ceviche One";
        title.fontSize = "64px";
        title.color = "white";
        title.resizeToFit = true;
        title.top = "14px";
        title.width = 0.8;
        title.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        imageRect.addControl(title);

        const startBtn = Button.CreateSimpleButton("start", "TO TITLE");
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
                    goToNextScene();
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

        return scene;
    }

}
