import {AbstractMesh, Color3, Nullable, StandardMaterial} from "@babylonjs/core";
import {Scene} from "@babylonjs/core/scene";

export default function manageMaterials ( meshes: AbstractMesh[], scene: Scene ): void {

    const meshesLength = meshes.length
    const meshesGroup: {maze: Nullable<AbstractMesh>, walls: AbstractMesh[], canvas: AbstractMesh[]} = {
        maze: scene.getMeshByName('maze'),
        walls: [],
        canvas: []
    };

    for(let i = 0; i < meshesLength; i++) {

        if(meshes[i].name.substr(0, 4) == 'wall') {

            meshesGroup.walls.push(meshes[i]);

        } else if(meshes[i].name.substr(0, 5) == 'canva') {

            meshesGroup.canvas.push(meshes[i]);
        }
    }

    manageMazeMaterial(meshesGroup.maze, scene);
    manageWallsMaterial(meshesGroup.walls, scene);
    manageCanvasMaterial(meshesGroup.canvas, scene);
}

function manageMazeMaterial(mesh: AbstractMesh, scene: Scene): void {

    const mazeMaterial = new StandardMaterial("mazeMaterial", scene);
    mazeMaterial.diffuseColor = new Color3(1, 0.5, 0.5);

    mesh.material = mazeMaterial;
}

function manageWallsMaterial ( meshes: AbstractMesh[], scene: Scene ): void {

    const meshesLength = meshes.length;

    const wallMaterial = new StandardMaterial("wallMaterial", scene);
    wallMaterial.diffuseColor = new Color3(1, 0.5, 0.5);

    for(let i = 0; i < meshesLength; i++) { meshes[i].material = wallMaterial; }
}

function manageCanvasMaterial ( meshes: AbstractMesh[], scene: Scene ): void {

    const meshesLength = meshes.length;

    const wallMaterial = new StandardMaterial("wallMaterial", scene);
    wallMaterial.diffuseColor = new Color3(0.5, 1, 0.5);

    for(let i = 0; i < meshesLength; i++) { meshes[i].material = wallMaterial; }
}
