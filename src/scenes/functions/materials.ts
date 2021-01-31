import {AbstractMesh, Color3, Nullable, StandardMaterial, Texture} from "@babylonjs/core";
import {Scene} from "@babylonjs/core/scene";

export default function manageMaterials(meshes: AbstractMesh[], scene: Scene): void {

    const meshesGroup: {maze: Nullable<AbstractMesh>, walls: AbstractMesh[], canvas: AbstractMesh[]} = {
        maze: scene.getMeshByName('maze'),
        walls: [],
        canvas: []
    };

    meshes.forEach((mesh) => {
        if (mesh.name.startsWith('wall')) {
            meshesGroup.walls.push(mesh);
        } else if (mesh.name.startsWith('canva')) {
            meshesGroup.canvas.push(mesh);
        }
    });

    manageMazeMaterial(meshesGroup.maze, scene);
    manageWallsMaterial(meshesGroup.walls, scene);
    manageCanvasMaterial(meshesGroup.canvas, scene);
}

function manageMazeMaterial(mesh: Nullable<AbstractMesh>, scene: Scene): void {
    if (mesh) {
        const mazeMaterial = new StandardMaterial("mazeMaterial", scene);
        mazeMaterial.diffuseColor = new Color3(1, 0.5, 0.5);
        mesh.material = mazeMaterial;
    }
}

function manageWallsMaterial(meshes: AbstractMesh[], scene: Scene): void {

    const wallMaterial = new StandardMaterial("wallMaterial", scene);
    wallMaterial.diffuseColor = new Color3(1, 0.5, 0.5);

    meshes.forEach((mesh) => mesh.material = wallMaterial);
}

function manageCanvasMaterial(meshes: AbstractMesh[], scene: Scene): void {

    meshes.forEach((mesh) => {
        const canvasMaterial = new StandardMaterial("canvasMaterial", scene);
        // canvasMaterial.diffuseColor = new Color3(0.5, 1, 0.5);
        canvasMaterial.diffuseTexture = new Texture("/public/sprites/"+getTextureName(mesh.name), scene);
        mesh.isPickable = true;
        mesh.material = canvasMaterial;
    });
}

function getTextureName(s: string): string {
    switch (s) {
        case 'canva_001':
            return "haut_de_forme.png";
        case 'canva_002':
            return "journal.png";
        case 'canva_003':
            return "lapin.png";
        case 'canva_004':
            return "haut_de_forme.png";
        case 'canva_005':
            return "journal.png";
        case 'canva_006':
            return "lapin.png";
    }
    return "";
}