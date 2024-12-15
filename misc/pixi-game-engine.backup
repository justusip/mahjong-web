import * as PIXI from 'pixi.js';
import {Camera3d, Container3d, Sprite2d} from "pixi-projection";

export default class GameEngine {
    renderer = new PIXI.Renderer({
        width: window.innerWidth,
        height: window.innerHeight,
        autoDensity: true,
        backgroundColor: 0x2a545e
    });
    stage = new Container3d();
    camera = new Camera3d();

    onInit(canvasContainer: HTMLDivElement) {
        console.log("onInit");
        canvasContainer.appendChild(this.renderer.view);

        // this.camera = new Camera3d();
        // this.camera.setPlanes(400, 10, 10000, false); // true if you want orthographics projection
        // this.camera.position.set(this.renderer.width / 2, this.renderer.height / 2);
        // this.stage.addChild(this.camera);

        // Create a white rectangle in the middle of the screen using pixi-projection
        const tile = new Sprite2d(PIXI.Texture.WHITE);

        this.stage.addChild(tile);
        tile.anchor.set(.5);
        tile.position.set(this.renderer.width / 2, this.renderer.height / 2);
        tile.scale.set(50 / tile.width);
        const w = this.renderer.width / 2;
        const h = this.renderer.height / 2;
        tile.proj.mapSprite(tile, [
            {x: w - 150, y: h - 150},
            {x: w + 150, y: h - 150},
            {x: w + 150, y: h + 150},
            {x: w - 150, y: h + 150}
        ]);


        // const tile = PIXI.Sprite.from('/tiles/up-0.png');
        // const tile = PIXI.Sprite.from(PIXI.Texture.WHITE);
        // this.stage.addChild(tile);
        // tile.anchor.set(.5);
        // tile.position.set(this.renderer.width / 2, this.renderer.height / 2);
        // tile.scale.set(50 / tile.width);
        // tile.tint = 0x000000;

        // Load spritesheet, slicing it into 9x6 tiles, and add the first one to the stage
        // const sheet = PIXI.BaseTexture.from('/img/symbols.png');
        // const texture = new PIXI.Texture(sheet, new PIXI.Rectangle(0, 0, sheet.width / 9, sheet.height / 6));
        // const sprite = new Sprite3d(texture);
        // sprite.anchor.set(.5);
        // this.stage.addChild(sprite);
        // sprite.position.set(this.renderer.width / 2, this.renderer.height / 2);
        // // Scale sprite to be 100 pixel wide and remain aspect ratio
        // sprite.scale.set(60 / sprite.width);
        //
        // // Project the sprite so that it looks like it's 3D
        // sprite.zIndex = 1;
        // sprite.proj.affine = AFFINE.AXIS_X;
        // sprite.proj.euler.x = .1;
    }

    onUpdate(deltaTime: number) {
        console.log("onUpdate");
        this.renderer.render(this.stage);
    }

    onEnd() {
        console.log("onEnd");
        this.renderer.view.remove();
        this.renderer.destroy();
        this.renderer = null;
        this.stage.destroy();
        this.stage = null;
    }

    onResize(width: number, height: number) {
        if (!width || !height)
            return;
        this.renderer.resize(width, height);
    }
}