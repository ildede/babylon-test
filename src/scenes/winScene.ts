import {Engine} from "@babylonjs/core/Engines/engine";
import {Scene} from "@babylonjs/core/scene";
import {Vector3} from "@babylonjs/core/Maths/math.vector";
import {Color4, Effect, PostProcess, UniversalCamera} from "@babylonjs/core";
import {AdvancedDynamicTexture, Button, Control, Image, Rectangle, TextBlock} from "@babylonjs/gui";

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

        const displayedImage0 = new Image("bg0", "/public/sprites/canva_mark_007_0.png");
        imageRect.addControl(displayedImage0);

        setTimeout(() => {
            displayedImage0.dispose();

            const displayedImage1 = new Image("bg1", "/public/sprites/canva_mark_007_1.png");
            imageRect.addControl(displayedImage1);

            setTimeout(() => {
                // displayedImage1.dispose();

                const displayedImage2 = new Image("bg2", "/public/sprites/canva_mark_007_2.png");
                imageRect.addControl(displayedImage2);

                setTimeout(() => {
                    // displayedImage2.dispose();

                    const displayedImage3 = new Image("bg3", "/public/sprites/canva_mark_007_3.png");
                    imageRect.addControl(displayedImage3);


                    setTimeout(() => {
                        // displayedImage3.dispose();

                        const displayedImage4 = new Image("bg4", "/public/sprites/canva_mark_007_4.png");
                        imageRect.addControl(displayedImage4);


                        setTimeout(() => {
                            // displayedImage4.dispose();

                            const displayedImage5 = new Image("bg5", "/public/sprites/canva_mark_007_5.png");
                            imageRect.addControl(displayedImage5);

                            setTimeout(() => {
                                // displayedImage5.dispose();

                                const displayedImage6 = new Image("bg6", "/public/sprites/canva_mark_007_6.png");
                                imageRect.addControl(displayedImage6);

                                setTimeout(() => {
                                    // displayedImage6.dispose();

                                    const displayedImage7 = new Image("bg7", "/public/sprites/canva_mark_007_7.png");
                                    imageRect.addControl(displayedImage7);


                                    setTimeout(() => {
                                        // displayedImage7.dispose();

                                        const displayedImage8 = new Image("bg8", "/public/sprites/canva_mark_007_8.png");
                                        imageRect.addControl(displayedImage8);

                                        setTimeout(() => {
                                            // displayedImage8.dispose();

                                            const displayedImage9 = new Image("bg9", "/public/sprites/canva_mark_007_9.png");
                                            imageRect.addControl(displayedImage9);

                                            setTimeout(() => {
                                                // displayedImage9.dispose();

                                                const displayedImage10 = new Image("bg10", "/public/sprites/canva_mark_007_10.png");
                                                imageRect.addControl(displayedImage10);

                                                const startBtn = Button.CreateSimpleButton("start", "TO TITLE");
                                                startBtn.fontFamily = "Viga";
                                                startBtn.width = 0.2;
                                                startBtn.height = 0.1;
                                                startBtn.color = "white";
                                                startBtn.thickness = 2;
                                                startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
                                                startBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
                                                imageRect.addControl(startBtn);

                                                startBtn.onPointerDownObservable.add(() => {
                                                    //fade screen
                                                    const postProcess = new PostProcess("Fade", "fade", ["fadeLevel"], null, 1.0, camera);
                                                    postProcess.onApply = (effect) => {
                                                        effect.setFloat("fadeLevel", fadeLevel);
                                                    };
                                                    this.isTransition = true;

                                                    scene.detachControl(); //observables disabled
                                                });

                                            }, 2500);

                                        }, 2500);

                                    }, 2500);

                                }, 2500);

                            }, 2500);

                        }, 2500);

                    }, 2500);

                }, 2500);

            }, 2500);

        }, 2500);


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
        //
        // //this handles interactions with the start button attached to the scene
        // startBtn.onPointerDownObservable.add(() => {
        //     //fade screen
        //     const postProcess = new PostProcess("Fade", "fade", ["fadeLevel"], null, 1.0, camera);
        //     postProcess.onApply = (effect) => {
        //         effect.setFloat("fadeLevel", fadeLevel);
        //     };
        //     this.isTransition = true;
        //
        //     scene.detachControl(); //observables disabled
        // });

        return scene;
    }

}
