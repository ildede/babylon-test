import {Scene} from "@babylonjs/core/scene";
import {AdvancedDynamicTexture, Image, Rectangle, StackPanel, TextBlock} from "@babylonjs/gui";
import {UniversalCamera} from "@babylonjs/core";

export class Hud {
    private scene: Scene;
    private camera: UniversalCamera;
    private hudMenu: AdvancedDynamicTexture;
    private canvas: HTMLCanvasElement;

    constructor(scene: Scene, camera: UniversalCamera, canvas: HTMLCanvasElement) {
        this.scene = scene;
        this.camera = camera;
        this.canvas = canvas;

        //--HUD--
        this.hudMenu = AdvancedDynamicTexture.CreateFullscreenUI("HUD");
        this.hudMenu.idealHeight = 720;

        const stackPanel = new StackPanel();
        stackPanel.height = "100%";
        stackPanel.width = "100%";
        stackPanel.top = "14px";
        stackPanel.verticalAlignment = 0;
        this.hudMenu.addControl(stackPanel);
    }

    public updateHud(): void {
        
    }

    showCanvas(targetName: string): Rectangle {
        const imageRect = new Rectangle("titleContainer");
        imageRect.width = 0.8;
        imageRect.height = 0.8;
        imageRect.thickness = 3;
        this.hudMenu.addControl(imageRect);

        if (targetName.endsWith("001") || targetName.endsWith("005")) {
            const displayedImage1 = new Image(targetName, "/public/sprites/"+targetName+"_0.png");
            imageRect.addControl(displayedImage1);

            setTimeout(() => {
                const displayedImage2 = new Image(targetName, "/public/sprites/"+targetName+"_1.png");
                imageRect.addControl(displayedImage2);
            }, 4000);

        } else {
            const startbg = new Image("startbg", "/public/sprites/"+targetName+".png");
            imageRect.addControl(startbg);
        }
        
        return imageRect;

    }
}