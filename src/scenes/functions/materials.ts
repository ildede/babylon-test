import {AbstractMesh, Color3, StandardMaterial} from "@babylonjs/core";
import {Scene} from "@babylonjs/core/scene";

export default function manageMazeMaterial(mesh: AbstractMesh, scene: Scene): void {

    const mazeMaterial = new StandardMaterial("mazeMaterial", scene);
    mazeMaterial.diffuseColor = new Color3(1, 0.5, 0.5);

    mesh.material = mazeMaterial;
    
    console.log(mesh.material);
}
