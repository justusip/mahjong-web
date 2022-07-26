import * as PIXI from 'pixi.js';
import * as THREE from "three";

export default class MiniScreen extends THREE.Mesh {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    texture: THREE.Texture;

    renderer: PIXI.Renderer;
    stage: PIXI.Container;
    width: number;
    height: number;

    constructor() {
        const geometry = new THREE.PlaneGeometry(.15, .15);
        const material = new THREE.MeshStandardMaterial({transparent: true, roughness: 0});
        super(geometry, material);

        this.width = 512;
        this.height = 512;
        this.canvas = document.createElement("canvas");
        this.texture = new THREE.Texture(this.canvas);
        this.renderer = new PIXI.Renderer({
            width: this.width,
            height: this.height,
            transparent: true,
            view: this.canvas,
            resolution: window.devicePixelRatio
        });
        this.stage = new PIXI.Container();
        material.map = this.texture;
        this.texture.needsUpdate = true;
    }

    draw(fung: number, guk: number, tileLeft: number, scores: number[]) {
        const style = new PIXI.TextStyle({
            dropShadow: true,
            dropShadowAngle: 0,
            dropShadowAlpha: 0.2,
            dropShadowBlur: 8,
            dropShadowColor: "white",
            dropShadowDistance: 0,
            fill: "white",
            fontFamily: "\"Lucida Console\", Monaco, monospace"
        });

        {
            const rectangle = PIXI.Sprite.from(PIXI.Texture.WHITE);
            this.stage.addChild(rectangle);
            rectangle.anchor.set(.5);
            rectangle.position.set(this.width / 2, this.height / 2);
            rectangle.width = this.width * .5;
            rectangle.height = this.height * .5;
            rectangle.tint = 0x000000;

            const guk = new PIXI.Text('東三局', {...style, fontSize: 64});
            this.stage.addChild(guk);
            guk.anchor.set(.5, .5);
            guk.position.set(256, 230);

            const tileRemaining = new PIXI.Text('剩餘 x3', {...style, fontSize: 32});
            this.stage.addChild(tileRemaining);
            tileRemaining.anchor.set(.5, .5);
            tileRemaining.position.set(256, 300);
        }

        for (let i = 0; i < 4; i++) {
            const container = new PIXI.Container();
            container.pivot.set(.5);
            container.position.set(this.width / 2, this.height / 2);
            this.stage.addChild(container);

            const bg = PIXI.Sprite.from(PIXI.Texture.WHITE);
            bg.anchor.set(.5);
            bg.position.set(0, 198);
            bg.width = this.width * .5;
            bg.height = this.height * .2;
            bg.tint = 0x000000;
            container.addChild(bg);

            const dirBg = PIXI.Sprite.from(PIXI.Texture.WHITE);
            dirBg.anchor.set(.5);
            dirBg.position.set(-80, 198);
            dirBg.width = this.width * .12;
            dirBg.height = this.height * .12;
            dirBg.tint = i === 0 ? 0xff0000 : 0x110000;
            container.addChild(dirBg);

            const dir = new PIXI.Text("東南西北"[i], {...style, fontSize: 42});
            dir.anchor.set(.5);
            dir.position.set(-80, 198);
            container.addChild(dir);

            const score = new PIXI.Text('000000', {...style, fontSize: 38});
            score.anchor.set(.5);
            score.position.set(35, 198);
            container.addChild(score);

            container.angle = i * -90;
        }
        this.renderer.reset();
        this.renderer.render(this.stage);
    }

}
