import {AbstractMesh, Color3, MultiMaterial, Nullable, PointLight, StandardMaterial, Texture} from "@babylonjs/core";
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

        } else if(meshes[i].name.substr(0, 8) == 'end_door') {

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
    manageEndDoorMaterial(meshesGroup.endDoor, scene);
    manageWallsMaterial(meshesGroup.walls, scene);
    manageCanvasMaterialAndCanvasLight(meshesGroup.canvas, scene);
    manageCanvasMarksMaterial(meshesGroup.canvasMarks, scene);
    managePathsMarksMaterial(meshesGroup.pathsMarks, scene);
}

function manageMazeMaterial(mesh: Nullable<AbstractMesh>, scene: Scene): void {

    if (mesh) {

        const mazeWallsMaterial = new StandardMaterial("mazeWallsMaterial", scene),
    		mazeGroundsMaterial = new StandardMaterial("mazeGroundsMaterial", scene),
			mazeMultiMaterial = new MultiMaterial("mazeMultiMaterial", scene);

    	mazeGroundsMaterial.diffuseTexture = new Texture('public/textures/mazegrounds_diffuse.png', scene);
    	mazeGroundsMaterial.emissiveTexture = new Texture('public/textures/mazegrounds_emissive.jpg', scene);
    	mazeGroundsMaterial.emissiveColor = new Color3(0.5,0.5,0.5);
    	mazeGroundsMaterial.diffuseTexture.uScale = 10;
    	mazeGroundsMaterial.diffuseTexture.vScale = 10;

    	mazeWallsMaterial.diffuseTexture = new Texture('public/textures/mazewalls_diffuse.png', scene);
    	mazeWallsMaterial.diffuseTexture.uScale = 4;
    	mazeWallsMaterial.emissiveTexture = new Texture('public/textures/mazewalls_emissive.jpg', scene);
    	mazeWallsMaterial.emissiveColor = new Color3(0.25,0.25,0.25);
    	mazeWallsMaterial.emissiveTexture.uScale = 4;

    	mazeGroundsMaterial.diffuseTexture.hasAlpha = mazeWallsMaterial.diffuseTexture.hasAlpha = true;

		mazeMultiMaterial.subMaterials.push(mazeWallsMaterial);
    	mazeMultiMaterial.subMaterials.push(mazeGroundsMaterial);

    	mesh.material = mazeMultiMaterial;
    }
}

function manageEndDoorMaterial(meshes: AbstractMesh[], scene: Scene): void {
    
    const doorMaterial = new StandardMaterial("doorMaterial", scene);
        doorMaterial.diffuseColor = new Color3(0, 0, 0);
    
    meshes.forEach((mesh) => { mesh.material = doorMaterial; });
}

function manageWallsMaterial(meshes: AbstractMesh[], scene: Scene): void {

   const wallMaterial = new StandardMaterial("wallMaterial", scene);
   wallMaterial.diffuseTexture = new Texture('public/textures/mazewalls_diffuse.png', scene);
   wallMaterial.diffuseTexture.hasAlpha = true;
   wallMaterial.emissiveTexture = new Texture('public/textures/mazewalls_emissive.jpg', scene);

    meshes.forEach((mesh) => { mesh.material = wallMaterial; });
}

function manageCanvasMaterialAndCanvasLight(meshes: AbstractMesh[], scene: Scene): void {

    const meshesLength = meshes.length;

    for(let i = 0; i < meshesLength; i++) { 

        const canvaMaterial = new StandardMaterial("canvaMaterial", scene);
    	canvaMaterial.diffuseTexture = new Texture('public/textures/canva_00' + (i + 1) + '_diffuse.jpg', scene);
    	canvaMaterial.emissiveTexture = new Texture('public/textures/canva_00' + (i + 1) + '_diffuse.jpg', scene);
    	canvaMaterial.specularColor = new Color3(0, 0, 0);
    	canvaMaterial.emissiveColor = new Color3(0.1,0.1,0.1);

        const light = new PointLight("light_"+mesh.name, mesh.position, scene);
        // const light = new SpotLight("light_"+mesh.name, mesh.position, new Vector3(0, -1, 0), Math.PI / 2, 10, scene);
        light.diffuse = new Color3(0, 1, 0);
        light.specular = new Color3(0, 1, 0);
        light.intensity = 0.05;
        light.parent = mesh;
    };
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
    pathMarkMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);

    meshes.forEach((mesh) => { mesh.material = pathMarkMaterial; });
}
