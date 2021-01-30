import {CreateSceneClass} from "../createScene";
import {Engine} from "@babylonjs/core/Engines/engine";
import {Scene} from "@babylonjs/core/scene";
import {Vector3} from "@babylonjs/core/Maths/math.vector";
import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight";
import {SphereBuilder} from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import {GroundBuilder} from "@babylonjs/core/Meshes/Builders/groundBuilder";
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial";
import {Texture} from "@babylonjs/core/Materials/Textures/texture";
import grassTextureUrl from "../../assets/grass.jpg";
import {UniversalCamera} from "@babylonjs/core";

class LostAndFound implements CreateSceneClass {

    createScene = async (engine: Engine, canvas: HTMLCanvasElement): Promise<Scene> => {
        const scene = new Scene(engine);
        scene.gravity = new Vector3(0, -1, 0);
        scene.collisionsEnabled = true;

        const camera = new UniversalCamera('UniversalCamera', new Vector3(0, 20, -20), scene);
        camera.setTarget(new Vector3(0, 10, 10));
        camera.attachControl(canvas, true);
        camera.ellipsoid = new Vector3(3, 10, 3);
        camera.applyGravity = true;
        camera.checkCollisions = true;

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        // Our built-in 'sphere' shape.
        const sphere1 = SphereBuilder.CreateSphere(
            "sphere1",
            { diameter: 10, segments: 32 },
            scene
        );
        sphere1.position = new Vector3(-10, 4, 0)
        sphere1.checkCollisions = true;
        // Our built-in 'sphere' shape.
        const sphere2 = SphereBuilder.CreateSphere(
            "sphere2",
            { diameter: 10, segments: 32 },
            scene
        );
        sphere2.position = new Vector3(10, 4, 0)
        sphere2.checkCollisions = true;

        const ground = GroundBuilder.CreateGround(
            "ground",
            { width: 400, height: 400 },
            scene
        );
        ground.checkCollisions = true;

        const groundMaterial = new StandardMaterial("ground material", scene);
        groundMaterial.diffuseTexture = new Texture(grassTextureUrl, scene);
        ground.material = groundMaterial;

        return scene;
    }
}

export default new LostAndFound();