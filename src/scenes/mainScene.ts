import {Engine} from "@babylonjs/core/Engines/engine";
import {Scene} from "@babylonjs/core/scene";
import {Vector3, Vector4} from "@babylonjs/core/Maths/math.vector";
import {
    AbstractMesh,
    AnimationGroup, Color3, Color4,
    Geometry, GlowLayer,
    IParticleSystem,
    Light, Mesh, MeshBuilder,
    PointerEventTypes,
    PointLight,
    Skeleton,
    Sound, StandardMaterial, Texture,
    TransformNode,
    UniversalCamera, Animation
} from "@babylonjs/core";
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader";
import {Hud} from "./hud";
import manageMazeMaterial from "./functions/materials";

export default class MainScene {

    static build(engine: Engine, canvas: HTMLCanvasElement, goToWinScene: () => Promise<void>, goToLoseScene: () => Promise<void>, input: string): [Scene, Hud] {
        const scene = new Scene(engine);
        scene.gravity = new Vector3(0, -1, 0);
        scene.collisionsEnabled = true;
        scene.clearColor = new Color4(0,0,0);
        scene.clearColor = new Color4(0,0,0);

        //--SOUNDS--
        const bgSound = new Sound(
            "startSong",
            "/public/sounds/bgm.mp3",
            scene,
            null,
            {volume: 1, loop: true, autoplay: true }
        );
        MainScene.createGameObjects(scene);

        const camera = new UniversalCamera('UniversalCamera', new Vector3(0, 4, 0), scene);
        camera.setTarget(new Vector3(0, 4, 50));
        camera.attachControl(canvas, true);
        camera.ellipsoid = new Vector3(2, 2, 2);
        camera.applyGravity = true;
        camera.checkCollisions = true;
        camera.speed = 0.7;
        camera.keysDown = [...camera.keysDown, 83]; //83 = S
        camera.keysRight = [...camera.keysRight, 68]; //68 = D
        if (input === "WASD") {
            camera.keysUp = [...camera.keysUp, 87]; //87 = W
            camera.keysLeft = [...camera.keysLeft, 65]; //65 = A
        } else if (input === "ZQSD") {
            camera.keysUp = [...camera.keysUp, 90]; //90 = Q
            camera.keysLeft = [...camera.keysLeft, 81]; //81 = Z
        }

        const hud = new Hud(scene, camera, canvas);

        scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case PointerEventTypes.POINTERPICK:
                    if (pointerInfo.pickInfo && pointerInfo.pickInfo.distance < 15) {
                        const pickedMesh = pointerInfo.pickInfo.pickedMesh;
                        if (pickedMesh != undefined && pickedMesh.isVisible && pickedMesh.name.startsWith("canva") && !pickedMesh.name.includes("mark")) {
                            pickedMesh.isVisible = false;
                            const targetMeshName = pickedMesh.name.split("_").join("_mark_");
                            const targetAudioName = "memory_"+pickedMesh.name.split("_")[1];
                            scene.meshes.forEach((v) => {
                                if (v.name === targetMeshName) {
                                    v.isVisible = true;
                                    bgSound.setVolume(0, 2);
                                    camera.inputs.clear();
                                    const memSound = new Sound(
                                        "souvenir",
                                        "/public/sounds/"+targetAudioName+".mp3",
                                        scene,
                                        null,
                                        {volume: 1, loop: false, autoplay: true},
                                    );
                                    const rectangle = hud.showCanvas(targetMeshName);
                                    memSound.onEndedObservable.add((eventData, eventState) => {
                                        bgSound.setVolume(1, 2);
                                        rectangle.dispose();
                                        camera.inputs.addKeyboard();
                                        camera.keysDown = [...camera.keysDown, 83]; //83 = S
                                        camera.keysRight = [...camera.keysRight, 68]; //68 = D
                                        if (input === "WASD") {
                                            camera.keysUp = [...camera.keysUp, 87]; //87 = W
                                            camera.keysLeft = [...camera.keysLeft, 65]; //65 = A
                                        } else if (input === "ZQSD") {
                                            camera.keysUp = [...camera.keysUp, 90]; //90 = Q
                                            camera.keysLeft = [...camera.keysLeft, 81]; //81 = Z
                                        }
                                        camera.inputs.addMouse();
                                        camera.attachControl(canvas, true);
                                    })
                                }
                            })
                            const memoriesCollected = scene.meshes.filter(value => value.name.startsWith('canva_mark') && value.isVisible).length;
                            if (memoriesCollected === 6) {
                                scene.meshes.forEach((v) => {
                                    if (v.name.startsWith("end_door")) {
                                        if (['end_door_001', 'end_door_002'].includes(v.name)) {
                                            const endDoorMaterial = new StandardMaterial("endDoorMaterial", scene);
                                            endDoorMaterial.emissiveColor = new Color3(0.0,0.1,0.1);
                                            v.material = endDoorMaterial;
                                        } else {
                                            const endWallMaterial = new StandardMaterial("endWallMaterial", scene);
                                            endWallMaterial.emissiveColor = new Color3(0.1,0.3,0.1);
                                            v.material = endWallMaterial;
                                        }
                                    }
                                })
                            }
                        }
                        if (pickedMesh != undefined && pickedMesh.isVisible && pickedMesh.name.startsWith("canva") && pickedMesh.name.includes("mark")) {
                            const targetMeshName = pickedMesh.name;
                            const targetAudioName = "memory_"+pickedMesh.name.split("_")[2];
                            scene.meshes.forEach((v) => {
                                if (v.name === targetMeshName) {
                                    bgSound.setVolume(0, 2);
                                    camera.inputs.clear();
                                    const memSound = new Sound(
                                        "souvenir",
                                        "/public/sounds/"+targetAudioName+".mp3",
                                        scene,
                                        null,
                                        {volume: 1, loop: false, autoplay: true},
                                    );
                                    const rectangle = hud.showCanvas(targetMeshName);
                                    memSound.onEndedObservable.add((eventData, eventState) => {
                                        bgSound.setVolume(1, 2);
                                        rectangle.dispose();
                                        camera.inputs.addKeyboard();
                                        camera.keysDown = [...camera.keysDown, 83]; //83 = S
                                        camera.keysRight = [...camera.keysRight, 68]; //68 = D
                                        if (input === "WASD") {
                                            camera.keysUp = [...camera.keysUp, 87]; //87 = W
                                            camera.keysLeft = [...camera.keysLeft, 65]; //65 = A
                                        } else if (input === "ZQSD") {
                                            camera.keysUp = [...camera.keysUp, 90]; //90 = Q
                                            camera.keysLeft = [...camera.keysLeft, 81]; //81 = Z
                                        }
                                        camera.inputs.addMouse();
                                        camera.attachControl(canvas, true);
                                    })
                                }
                            })
                        }
                        if (pickedMesh != undefined && pickedMesh.name.startsWith("end_door_001")) {
                            scene.beginAnimation(pickedMesh, 0, 20, false);
                        }
                        if (pickedMesh != undefined && pickedMesh.name.startsWith("end_door_002")) {
                            const memoriesCollected = scene.meshes.filter(value => value.name.startsWith('canva_mark') && value.isVisible).length;
                            if (memoriesCollected === 6) {
                                goToWinScene();
                            }
                        }
                    }
                    break;
            }
        });

        // let keyEnabled = true;
        // window.addEventListener("keydown", (ev: KeyboardEvent) => {
        //     if (keyEnabled && ev.key === 'W') {
        //         keyEnabled = false;
        //         goToWinScene();
        //     }
        // });

        let isLocked = false;
        // On click event, request pointer lock
        scene.onPointerDown = function (evt) {
            //true/false check if we're locked, faster than checking pointerlock on each single click.
            if (!isLocked) {
                canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
                if (canvas.requestPointerLock) {
                    canvas.requestPointerLock();
                }
            }
        };
        // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
        const pointerlockchange = function () {
            // @ts-ignore
            const controlEnabled = document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || document.pointerLockElement || null;
            // If the user is already locked
            if (!controlEnabled) {
                //camera.detachControl(canvas);
                isLocked = false;
            } else {
                //camera.attachControl(canvas);
                isLocked = true;
            }
        };

        // Attach events to the document
        document.addEventListener("pointerlockchange", pointerlockchange, false);
        document.addEventListener("mspointerlockchange", pointerlockchange, false);
        document.addEventListener("mozpointerlockchange", pointerlockchange, false);
        document.addEventListener("webkitpointerlockchange", pointerlockchange, false);

        return [scene, hud];
    }

    private static createGameObjects(scene: Scene): void {
        const gl = new GlowLayer("glow", scene);
        gl.intensity = 2;
        SceneLoader.ImportMesh(
            "",
            "public/models/",
            "scene.babylon",
            scene,
            (allMeshes: AbstractMesh[], particles: IParticleSystem[], skeletons: Skeleton[], animations: AnimationGroup[], transforms: TransformNode[], geometries: Geometry[], lights: Light[]) => {
                manageMazeMaterial(allMeshes, scene);
            },
            () => { console.log("on progress"); }
        );
    }

}
