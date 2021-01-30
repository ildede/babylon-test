function manageMazeMaterial ( mesh, scene ) {

    let mazeMaterial = new BABYLON.StandardMaterial("mazeMaterial", scene);
    mazeMaterial.diffuseColor = new BABYLON.Color3(1, 0.5, 0.5);

    mesh.material = mazeMaterial;
} 
