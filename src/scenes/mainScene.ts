import {Engine} from "@babylonjs/core/Engines/engine";
import {Scene} from "@babylonjs/core/scene";
import {Vector3} from "@babylonjs/core/Maths/math.vector";
import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight";
import {SphereBuilder} from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import {Mesh, Sound, UniversalCamera} from "@babylonjs/core";
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial";
import {Texture} from "@babylonjs/core/Materials/Textures/texture";
import grassTextureUrl from "../../assets/grass.jpg";
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader";
import controllerModel from "../../assets/glb/samsung-controller.glb";

export default class MainScene {

    static build(engine: Engine, canvas: HTMLCanvasElement): Scene {
        const scene = new Scene(engine);
        scene.gravity = new Vector3(0, -1, 0);
        scene.collisionsEnabled = true;

        // const importResult = await SceneLoader.ImportMeshAsync(
        //     "",
        //     "",
        //     controllerModel,
        //     scene,
        //     undefined,
        //     ".glb"
        // );

        // just scale it so we can see it better
        // importResult.meshes[0].scaling.scaleInPlace(10);
        //--SOUNDS--
        const start = new Sound(
            "startSong",
            "./sounds/alice.mp3",
            scene,
            () => {console.log("readyToPlay callback");},
            {volume: 0.25, loop: true, autoplay: true}
        );

        MainScene.createGround(scene);
        MainScene.createWalls(scene);
        MainScene.createLights(scene);
        MainScene.createSpheres(scene);

        const camera = new UniversalCamera('UniversalCamera', new Vector3(0, 20, -20), scene);
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
        const ground = Mesh.CreateBox("ground", 400, scene);
        ground.scaling = new Vector3(1,.02,1);
        ground.checkCollisions = true;
    }

    private static createWalls(scene: Scene): void {
        const groundMaterial = new StandardMaterial("ground material", scene);
        groundMaterial.diffuseTexture = new Texture(grassTextureUrl, scene);

        const wall1 = Mesh.CreateBox("wall1", 100, scene);
        wall1.scaling = new Vector3(1,.2,.05);
        wall1.position = new Vector3(50, 10, 50)
        wall1.checkCollisions = true;
        const wall2 = Mesh.CreateBox("wall2", 100, scene);
        wall2.scaling = new Vector3(1,.2,.05);
        wall2.position = new Vector3(50, 10, -50)
        wall2.checkCollisions = true;
        const wall3 = Mesh.CreateBox("wall3", 100, scene);
        wall3.scaling = new Vector3(.05,.2,1);
        wall3.position = new Vector3(100, 10, 0)
        wall3.checkCollisions = true;

        wall1.material = groundMaterial;
        wall2.material = groundMaterial;
        wall3.material = groundMaterial;
    }

    private static createSpheres(scene: Scene): void {
        // Our built-in 'sphere' shape.
        const sphere1 = SphereBuilder.CreateSphere(
            "sphere1",
            {diameter: 10, segments: 32},
            scene
        );
        sphere1.position = new Vector3(-10, 4, 0)
        sphere1.checkCollisions = true;
        // Our built-in 'sphere' shape.
        const sphere2 = SphereBuilder.CreateSphere(
            "sphere2",
            {diameter: 10, segments: 32},
            scene
        );
        sphere2.position = new Vector3(10, 4, 0)
        sphere2.checkCollisions = true;
    }
}
