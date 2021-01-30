function manageMazeMaterial ( mesh ) {

    let mazeMaterial = new BABYLON.StandardMaterial("mazeMaterial", runningScene);
    mazeMaterial.diffuseColor = new BABYLON.Color3(1, 0.5, 0.5);

    mesh.material = mazeMaterial;
} 
