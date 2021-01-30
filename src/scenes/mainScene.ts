import {Engine} from "@babylonjs/core/Engines/engine";
import {Scene} from "@babylonjs/core/scene";
import {Vector3} from "@babylonjs/core/Maths/math.vector";
import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight";
import {Mesh, Sound, UniversalCamera} from "@babylonjs/core";
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader";

export default class MainScene {

    static build(engine: Engine, canvas: HTMLCanvasElement): Scene {
        const scene = new Scene(engine);
        scene.gravity = new Vector3(0, -1, 0);
        scene.collisionsEnabled = true;

        //--SOUNDS--
        new Sound(
            "startSong",
            "./sounds/alice.mp3",
            scene,
            () => {console.log("readyToPlay callback");},
            {volume: 0.25, loop: true, autoplay: true}
        );

        MainScene.createGround(scene);
        MainScene.createLights(scene);
        MainScene.createCustomMeshes(scene);

        const camera = new UniversalCamera('UniversalCamera', new Vector3(0, 5, -40), scene);
        camera.setTarget(new Vector3(0, 10, 10));
        camera.attachControl(canvas, true);
        camera.ellipsoid = new Vector3(3, 10, 3);
        camera.applyGravity = true;
        camera.checkCollisions = true;

        return scene;
    }

    private static createLights(scene: Scene): void {
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;
    }

    private static createGround(scene: Scene): void {
        const ground = Mesh.CreateBox("ground", 500, scene);
        ground.position = new Vector3(0, -10, 0)
        ground.scaling = new Vector3(1,.01,1);
        ground.checkCollisions = true;
    }

    private static createCustomMeshes(scene: Scene) {
        SceneLoader.ImportMesh(
            "",
            "models/",
            "mesh_default.babylon",
            scene,
            (a, b,c, d, e, f, g) => {
                console.log("succes");
                console.log(a);
                console.log(b);
                console.log(c);
                console.log(d);
                console.log(e);
                console.log(f);
                console.log(g);
                a.forEach((mesh) => {
                    console.log(mesh);
                    mesh.checkCollisions = true;
                })
            },
            () => {
                console.log("on progress");
            }
        );
    }
}
