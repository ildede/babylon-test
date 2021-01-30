import {Engine} from "@babylonjs/core/Engines/engine";
import {Scene} from "@babylonjs/core/scene";
import {Vector3} from "@babylonjs/core/Maths/math.vector";
import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight";
import {
    AbstractMesh,
    AnimationGroup, Geometry,
    IParticleSystem, Light,
    Mesh, PointLight,
    Skeleton,
    Sound,
    TransformNode,
    UniversalCamera
} from "@babylonjs/core";
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader";
import {Hud} from "./hud";
import manageMazeMaterial from "./functions/materials";

export default class MainScene {

    static build(engine: Engine, canvas: HTMLCanvasElement, goToWinScene: () => Promise<void>, goToLoseScene: () => Promise<void>): [Scene,Hud] {
        const scene = new Scene(engine);
        scene.gravity = new Vector3(0, -1, 0);
        scene.collisionsEnabled = true;

        //--SOUNDS--
        new Sound(
            "startSong",
            "/public/sounds/alice.mp3",
            scene,
            () => {console.log("readyToPlay callback");},
            {volume: 0.25, loop: true, autoplay: true}
        );
        MainScene.createLights(scene);
        MainScene.createCustomMeshes(scene);

        const camera = new UniversalCamera('UniversalCamera', new Vector3(0, 4, 0), scene);
        camera.setTarget(new Vector3(0, 4, 50));
        camera.attachControl(canvas, true);
        camera.ellipsoid = new Vector3(2, 2, 2);
        camera.applyGravity = true;
        camera.checkCollisions = true;

        let keyEnabled = true;
        window.addEventListener("keydown", (ev: KeyboardEvent) => {
            if (keyEnabled && ev.key === 'W') {
                keyEnabled = false;
                goToWinScene();
            }
            if (keyEnabled && ev.key === 'L') {
                keyEnabled = false;
                goToLoseScene();
            }
        });
        const hud = new Hud(scene);
        return [scene, hud];
    }

    private static createLights(scene: Scene): void {
        const light1 = new PointLight("pointLight", new Vector3(0, 1, 10), scene);
        light1.intensity = 0.2;
        const light2 = new PointLight("pointLight", new Vector3(0, 1, 40), scene);
        light2.intensity = 0.2;
        const light3 = new PointLight("pointLight", new Vector3(60, 1, 40), scene);
        light3.intensity = 0.2;
    }

    private static createCustomMeshes(scene: Scene) {
        SceneLoader.ImportMesh(
            "",
            "public/models/",
            "scene.babylon",
            scene,
            (allMeshes: AbstractMesh[], particles: IParticleSystem[], skeletons: Skeleton[], animations: AnimationGroup[], transforms: TransformNode[], geometries: Geometry[], lights: Light[]) => {
                console.log('allMeshes', allMeshes);
                console.log('particles', particles);
                console.log('skeletons', skeletons);
                console.log('animations', animations);
                console.log('transforms', transforms);
                console.log('geometries', geometries);
                console.log('lights', lights);
                allMeshes.forEach((mesh) => {
                    console.log('Work with mesh', mesh);
                    manageMazeMaterial(mesh, scene);
                })
            },
            () => {
                console.log("on progress");
            }
        );
    }
}
