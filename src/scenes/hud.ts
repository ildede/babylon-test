import {Scene} from "@babylonjs/core/scene";
import {AdvancedDynamicTexture, StackPanel, TextBlock} from "@babylonjs/gui";

export class Hud {
    private scene: Scene;

    private clockTime: TextBlock; //GAME TIME

    constructor(scene: Scene) {
        this.scene = scene;

        //--HUD--
        const hudMenu = AdvancedDynamicTexture.CreateFullscreenUI("HUD");
        hudMenu.idealHeight = 720;

        const stackPanel = new StackPanel();
        stackPanel.height = "100%";
        stackPanel.width = "100%";
        stackPanel.top = "14px";
        stackPanel.verticalAlignment = 0;
        hudMenu.addControl(stackPanel);

        //Game timer text
        const textOnScreen = new TextBlock();
        textOnScreen.name = "clock";
        textOnScreen.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
        textOnScreen.fontSize = "48px";
        textOnScreen.color = "white";
        textOnScreen.text = "This can be anything";
        textOnScreen.resizeToFit = true;
        textOnScreen.height = "96px";
        textOnScreen.width = "220px";
        textOnScreen.fontFamily = "Viga";
        stackPanel.addControl(textOnScreen);
        this.clockTime = textOnScreen;
    }

    public updateHud(): void {
        // console.log("Update hud!");
    }

}