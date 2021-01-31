import {Engine} from "@babylonjs/core/Engines/engine";
import {Scene} from "@babylonjs/core/scene";
import {Vector3, Vector4} from "@babylonjs/core/Maths/math.vector";
import {
    AbstractMesh,
    AnimationGroup,
    Geometry,
    IParticleSystem,
    Light, Mesh, MeshBuilder,
    PointerEventTypes,
    PointLight,
    Skeleton,
    Sound, StandardMaterial, Texture,
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
            "/public/sounds/bgm.mp3",
            scene,
            null,
            {volume: 1, loop: true, autoplay: true }
        );
        MainScene.createLights(scene);
        MainScene.createGameObjects(scene);

        const camera = new UniversalCamera('UniversalCamera', new Vector3(0, 4, 0), scene);
        camera.setTarget(new Vector3(0, 4, 50));
        camera.attachControl(canvas, true);
        camera.ellipsoid = new Vector3(2, 2, 2);
        camera.applyGravity = true;
        camera.checkCollisions = true;

        scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case PointerEventTypes.POINTERPICK:
                    console.log("POINTER PICK", pointerInfo);
                    if (pointerInfo.pickInfo && pointerInfo.pickInfo.distance < 15) {
                        const pickedMesh = pointerInfo.pickInfo.pickedMesh;
                        if (pickedMesh != undefined && pickedMesh.isVisible) {
                            pickedMesh.isVisible = false;
                            const targetMeshName = pickedMesh.name.split("_").join("_mark_");
                            scene.meshes.forEach((v) => {
                                if (v.name === targetMeshName) {
                                    v.isVisible = true;
                                    new Sound(
                                        "souvenir",
                                        "/public/sounds/"+pickedMesh.name+".mp3",
                                        scene,
                                        null,
                                        {volume: 1, loop: false, autoplay: true},
                                    );
                                }
                            })
                        }
                    }
                    break;
            }
        });

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

    private static createGameObjects(scene: Scene): void {
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
                manageMazeMaterial(allMeshes, scene);
            },
            () => { console.log("on progress"); }
        );
    }

    private static createEndCanvasObjects(scene: Scene): Mesh[] {
        const f = new Vector4(0,0, 1, 1); // front image = half the whole image along the width
        const b = new Vector4(0,0, 0, 1); // back image = second half along the width

        const appartNormale = MeshBuilder.CreatePlane("done_canva_001",
            {height:3.5, width: 6, sideOrientation: Mesh.DOUBLESIDE, frontUVs: f, backUVs: b},
            scene);
        appartNormale.position = new Vector3(-15, 3, 50);
        appartNormale.billboardMode = Mesh.BILLBOARDMODE_Y;
        appartNormale.isVisible = false;
        const appartNormaleMat = new StandardMaterial("", scene);
        appartNormaleMat.diffuseTexture = new Texture("/public/sprites/canva_mark_001.png", scene);
        appartNormale.material = appartNormaleMat;

        const appartNuitLighter = MeshBuilder.CreatePlane("done_canva_002",
            {height:3.5, width: 6, sideOrientation: Mesh.DOUBLESIDE, frontUVs: f, backUVs: b},
            scene);
        appartNuitLighter.position = new Vector3(-15, 3, 40);
        appartNuitLighter.billboardMode = Mesh.BILLBOARDMODE_Y;
        appartNuitLighter.isVisible = false;
        const appartNuitLighterMat = new StandardMaterial("", scene);
        appartNuitLighterMat.diffuseTexture = new Texture("/public/sprites/appart_nuit_lighter.png", scene);
        appartNuitLighter.material = appartNuitLighterMat;

        const jardinLapinVieilli = MeshBuilder.CreatePlane("done_canva_003",
            {height:3.5, width: 6, sideOrientation: Mesh.DOUBLESIDE, frontUVs: f, backUVs: b},
            scene);
        jardinLapinVieilli.position = new Vector3(-15, 3, 30);
        jardinLapinVieilli.billboardMode = Mesh.BILLBOARDMODE_Y;
        jardinLapinVieilli.isVisible = false;
        const jardinLapinVieilliMat = new StandardMaterial("", scene);
        jardinLapinVieilliMat.diffuseTexture = new Texture("/public/sprites/jardin_lapin_vieilli.png", scene);
        jardinLapinVieilli.material = jardinLapinVieilliMat;

        const souvguerre = MeshBuilder.CreatePlane("done_canva_004",
            {height:3.5, width: 6, sideOrientation: Mesh.DOUBLESIDE, frontUVs: f, backUVs: b},
            scene);
        souvguerre.position = new Vector3(-15, 3, 20);
        souvguerre.billboardMode = Mesh.BILLBOARDMODE_Y;
        souvguerre.isVisible = false;
        const souvguerreMat = new StandardMaterial("", scene);
        souvguerreMat.diffuseTexture = new Texture("/public/sprites/souvguerre.png", scene);
        souvguerre.material = souvguerreMat;

        return [appartNormale, appartNuitLighter, jardinLapinVieilli, souvguerre];
    }
}
