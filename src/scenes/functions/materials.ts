import {AbstractMesh, Animation, Color3, MultiMaterial, Nullable, StandardMaterial, Texture} from "@babylonjs/core";
import {Scene} from "@babylonjs/core/scene";

export default function manageMaterials(meshes: AbstractMesh[], scene: Scene): void {

    const meshesGroup: {
        maze: Nullable<AbstractMesh>,
        endDoors: AbstractMesh[],
        walls: AbstractMesh[],
        canvas: AbstractMesh[],
        canvasMarks: AbstractMesh[],
        pathsMarks: AbstractMesh[]
    } = {
        maze : scene.getMeshByName('maze'),
        endDoors : [],
        walls : [],
        canvas : [],
        canvasMarks : [],
        pathsMarks : [],
    };

    meshes.forEach((mesh) => {

        if (mesh.name.startsWith('wall')) {

            meshesGroup.walls.push(mesh);

        } else if(mesh.name.substr(0, 8) == 'end_door') {

            meshesGroup.endDoors.push(mesh);

        } else if (mesh.name.startsWith('canva_mark')) {

            meshesGroup.canvasMarks.push(mesh);

        } else if (mesh.name.startsWith('canva')) {

            meshesGroup.canvas.push(mesh);

        } else if (mesh.name.startsWith('path_mark')) {

            meshesGroup.pathsMarks.push(mesh);
        }
    });


    manageMazeMaterial(meshesGroup.maze, scene);
    manageEndDoorMaterial(meshesGroup.endDoors, scene);
    manageWallsMaterial(meshesGroup.walls, scene);
    manageCanvasMaterialAndCanvasLight(meshesGroup.canvas, scene);
    manageCanvasMarksMaterial(meshesGroup.canvasMarks, scene);
    managePathsMarksMaterial(meshesGroup.pathsMarks, scene);
}

function manageMazeMaterial(mesh: Nullable<AbstractMesh>, scene: Scene): void {

    if (mesh) {

        const mazeWallsMaterial = new StandardMaterial("mazeWallsMaterial", scene);
        const mazeGroundsMaterial = new StandardMaterial("mazeGroundsMaterial", scene);
        const mazeMultiMaterial = new MultiMaterial("mazeMultiMaterial", scene);

        mazeGroundsMaterial.diffuseTexture = new Texture('/public/textures/mazegrounds_diffuse.png', scene);
        mazeGroundsMaterial.emissiveTexture = new Texture('/public/textures/mazegrounds_emissive.jpg', scene);
        mazeGroundsMaterial.emissiveColor = new Color3(0.1,0.1,0.1);

        mazeWallsMaterial.diffuseTexture = new Texture('/public/textures/mazewalls_diffuse.png', scene);
        // @ts-ignore
        mazeWallsMaterial.diffuseTexture.uScale = 3;
        mazeWallsMaterial.emissiveTexture = new Texture('/public/textures/mazewalls_emissive.jpg', scene);
        mazeWallsMaterial.emissiveColor = new Color3(0.1,0.1,0.1);
        // @ts-ignore
        mazeWallsMaterial.emissiveTexture.vScale = 3;

        mazeGroundsMaterial.diffuseTexture.hasAlpha = mazeWallsMaterial.diffuseTexture.hasAlpha = true;

        mazeMultiMaterial.subMaterials.push(mazeWallsMaterial);
        mazeMultiMaterial.subMaterials.push(mazeGroundsMaterial);

        mesh.material = mazeMultiMaterial;
    }
}

function manageEndDoorMaterial(meshes: AbstractMesh[], scene: Scene): void {

    const doorMaterial = new StandardMaterial("doorMaterial", scene);
    doorMaterial.diffuseColor = new Color3(0, 0, 0);

    meshes.forEach((mesh) => {
        mesh.material = doorMaterial;
        mesh.isPickable = true;
        if (mesh.name === 'end_door_001') {
            const frameRate = 10;
            const ySlide = new Animation("ySlide", "position.y", frameRate, Animation.ANIMATIONTYPE_FLOAT);
            const keyFrames = [];
            keyFrames.push({frame: 0, value: 0});
            keyFrames.push({frame: frameRate, value: -4});
            keyFrames.push({frame: 2 * frameRate, value: -8});
            ySlide.setKeys(keyFrames);
            mesh.animations.push(ySlide);
        }
    });
}

function manageWallsMaterial(meshes: AbstractMesh[], scene: Scene): void {

   const wallMaterial = new StandardMaterial("wallMaterial", scene);
   wallMaterial.diffuseTexture = new Texture('/public/textures/mazewalls_diffuse.png', scene);
   wallMaterial.diffuseTexture.hasAlpha = true;
   wallMaterial.emissiveTexture = new Texture('/public/textures/mazewalls_emissive.jpg', scene);

   meshes.forEach((mesh) => { mesh.material = wallMaterial; });
}

function manageCanvasMaterialAndCanvasLight(meshes: AbstractMesh[], scene: Scene): void {

    meshes.forEach((mesh) => {
        const canvaMaterial = new StandardMaterial("canvaMaterial", scene);
        canvaMaterial.diffuseTexture = new Texture('/public/sprites/' + mesh.name + '.png', scene);
        canvaMaterial.emissiveTexture = new Texture('/public/sprites/' + mesh.name + '.png', scene);
        canvaMaterial.specularColor = new Color3(0, 0, 0);
        canvaMaterial.emissiveColor = new Color3(0.1,0.1,0.1);

        mesh.material = canvaMaterial;
    })
}

function manageCanvasMarksMaterial(meshes: AbstractMesh[], scene: Scene): void {

    meshes.forEach((mesh) => {
        const canvaMarkMaterial = new StandardMaterial("wallMaterial", scene);
        canvaMarkMaterial.diffuseTexture = new Texture("/public/sprites/"+mesh.name+".png", scene);
        canvaMarkMaterial.emissiveTexture = new Texture("/public/sprites/"+mesh.name+".png", scene);
        canvaMarkMaterial.specularColor = new Color3(0, 0, 0);
        canvaMarkMaterial.emissiveColor = new Color3(0.05,0.05,0.05);
        mesh.isVisible = false;
        mesh.isPickable = true;
        mesh.material = canvaMarkMaterial;
    });
}

function managePathsMarksMaterial(meshes: AbstractMesh[], scene: Scene): void {

    const pathMarkMaterial = new StandardMaterial("pathMarkMaterial", scene);
    pathMarkMaterial.emissiveColor = new Color3(0,0,0);

    meshes.forEach((mesh) => {
        mesh.material = pathMarkMaterial;
        mesh.checkCollisions = true;
    });
}
