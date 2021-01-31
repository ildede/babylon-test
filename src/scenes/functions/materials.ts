import {AbstractMesh, Color3, MultiMaterial, Nullable, PointLight, StandardMaterial, Texture} from "@babylonjs/core";
import {Scene} from "@babylonjs/core/scene";

export default function manageMaterials(meshes: AbstractMesh[], scene: Scene): void {

    const meshesGroup: {
        maze: Nullable<AbstractMesh>,
        endDoor: Nullable<AbstractMesh>,
        walls: AbstractMesh[],
        canvas: AbstractMesh[],
        canvasMarks: AbstractMesh[],
        pathsMarks: AbstractMesh[]
    } = {
        maze : scene.getMeshByName('maze'),
        endDoor : scene.getMeshByName('end_door'),
        walls : [],
        canvas : [],
        canvasMarks : [],
        pathsMarks : [],
    };

    meshes.forEach((mesh) => {

        if (mesh.name.startsWith('wall')) {

            meshesGroup.walls.push(mesh);

        } else if (mesh.name.startsWith('canva_mark')) {

            meshesGroup.canvasMarks.push(mesh);

        } else if (mesh.name.startsWith('canva')) {

            meshesGroup.canvas.push(mesh);

        } else if (mesh.name.startsWith('path_mark')) {

            meshesGroup.pathsMarks.push(mesh);
        }
    });

    manageMazeMaterial(meshesGroup.maze, scene);
    manageEndDoorMaterial(meshesGroup.endDoor, scene);
    manageWallsMaterial(meshesGroup.walls, scene);
    manageCanvasMaterialAndCanvasLight(meshesGroup.canvas, scene);
    manageCanvasMarksMaterial(meshesGroup.canvasMarks, scene);
    managePathsMarksMaterial(meshesGroup.pathsMarks, scene);
}

function manageMazeMaterial(mesh: Nullable<AbstractMesh>, scene: Scene): void {

    if (mesh) {

        const mazeGroundsMaterial = new StandardMaterial("mazeGroundsMaterial", scene);
        const mazeWallsMaterial = new StandardMaterial("mazeWallsMaterial", scene);
        const mazeMultiMaterial = new MultiMaterial("mazeMultiMaterial", scene);

        mazeGroundsMaterial.diffuseColor = new Color3(1, 0.5, 0.5);
        mazeWallsMaterial.diffuseColor = new Color3(1, 0.5, 1);

        mazeMultiMaterial.subMaterials.push(mazeGroundsMaterial);
        mazeMultiMaterial.subMaterials.push(mazeWallsMaterial);

        mesh.material = mazeMultiMaterial;
    }
}

function manageEndDoorMaterial(mesh: Nullable<AbstractMesh>, scene: Scene): void {

    if (mesh) {

        const doorMaterial = new StandardMaterial("doorMaterial", scene);
        doorMaterial.diffuseColor = new Color3(0.5, 0.5, 1);

        mesh.material = doorMaterial;
    }
}

function manageWallsMaterial(meshes: AbstractMesh[], scene: Scene): void {

    const wallMaterial = new StandardMaterial("wallMaterial", scene);
    wallMaterial.diffuseColor = new Color3(1, 0.5, 0.5);

    meshes.forEach((mesh) => { mesh.material = wallMaterial; });
}

function manageCanvasMaterialAndCanvasLight(meshes: AbstractMesh[], scene: Scene): void {

    meshes.forEach((mesh) => {

        const canvasMaterial = new StandardMaterial("canvasMaterial", scene);
        canvasMaterial.diffuseTexture = new Texture("/public/sprites/"+mesh.name+".png", scene);
        mesh.isPickable = true;
        mesh.material = canvasMaterial;

        const light = new PointLight("light_"+mesh.name, mesh.position, scene);
        // const light = new SpotLight("light_"+mesh.name, mesh.position, new Vector3(0, -1, 0), Math.PI / 2, 10, scene);
        light.diffuse = new Color3(0, 1, 0);
        light.specular = new Color3(0, 1, 0);
        light.intensity = 0.05;
        light.parent = mesh;
    });
}

function manageCanvasMarksMaterial(meshes: AbstractMesh[], scene: Scene): void {

    meshes.forEach((mesh) => {
        const canvaMarkMaterial = new StandardMaterial("wallMaterial", scene);
        canvaMarkMaterial.diffuseTexture = new Texture("/public/sprites/"+mesh.name+".png", scene);
        mesh.isVisible = false;
        mesh.isPickable = false;
        mesh.material = canvaMarkMaterial;
    });
}

function managePathsMarksMaterial(meshes: AbstractMesh[], scene: Scene): void {

    const pathMarkMaterial = new StandardMaterial("wallMaterial", scene);
    pathMarkMaterial.diffuseColor = new Color3(1, 1, 0.5);

    meshes.forEach((mesh) => { mesh.material = pathMarkMaterial; });
}
