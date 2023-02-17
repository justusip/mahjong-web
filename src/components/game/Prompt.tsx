import * as PIXI from 'pixi.js';
import {IRenderingContext} from "pixi.js";
import * as THREE from "three";

export default class Prompt extends THREE.Mesh {
    canvasElem: HTMLCanvasElement;
    texture: THREE.Texture;

    renderer: PIXI.Renderer;
    stage: PIXI.Container;
    width: number;
    height: number;

    constructor(context: WebGLRenderingContext) {
        const geometry = new THREE.PlaneGeometry(.3, .3);
        const material = new THREE.MeshBasicMaterial({transparent: true});
        super(geometry, material);

        this.width = 1024;
        this.height = 1024;
        this.canvasElem = document.createElement("canvas");
        this.texture = new THREE.Texture(this.canvasElem);
        this.renderer = new PIXI.Renderer({
            context: context as IRenderingContext,
            width: this.width,
            height: this.height,
            backgroundAlpha: 0,
            view: this.canvasElem,
            resolution: window.devicePixelRatio
        });
        this.stage = new PIXI.Container();
        material.map = this.texture;
        this.texture.needsUpdate = true;

    }

    init() {
        const circle = this.stage.addChild(new PIXI.Graphics()
            .beginFill(0xffffff)
            .lineStyle({color: 0x111111, alpha: 0.87, width: 1})
            .drawCircle(0, 0, 8)
            .endFill());
        circle.position.set(this.width / 2, this.height / 2);

// Enable interactivity!
        this.stage.interactive = true;

// Make sure the whole canvas area is interactive, not just the circle.
        this.stage.hitArea = this.renderer.screen;
        console.log(circle.position);

// Follow the pointer
        this.stage.on('pointermove', (e) => {
            console.log(circle.position);
            circle.position.copyFrom(e.global);
        });

        const rectangle = PIXI.Sprite.from(PIXI.Texture.WHITE);
        this.stage.addChild(rectangle);
        rectangle.anchor.set(.5);
        rectangle.position.set(this.width / 2, this.height / 2);
        rectangle.width = this.width;
        rectangle.height = this.height;
        rectangle.tint = 0x000000;
        rectangle.alpha = .2;

        let i = 0;
        for (const o of [
            "/pile/skip.png",
            "/pile/pung.png",
            "/pile/soeng.png",
            "/pile/gong.png",
        ]) {
            const tex = PIXI.Sprite.from("/pile/shock.png");
            this.stage.addChild(tex);
            tex.anchor.set(1, .5);
            // tex.scale.set(.5);
            tex.position.set(this.width / 2, this.height / 2);
            tex.tint = 0;

            const over = PIXI.Sprite.from("/pile/shock.png");
            tex.addChild(over);
            over.anchor.set(1, .5);
            over.position.set(-30, -10);
            over.tint = 0xff0000;
            over.interactive = true;
            over.on("pointerdown", e => {
                console.log(i);
            });

            const text = PIXI.Sprite.from(o);
            tex.addChild(text);
            text.anchor.set(0, .5);
            text.position.set(-400, -10);

            tex.position.x -= Math.random() * 10;
            tex.rotation = (-20 + i * 20) / 180 * Math.PI;
            i++;

            // const style = new PIXI.TextStyle({
            //     dropShadow: true,
            //     dropShadowAngle: 0,
            //     dropShadowAlpha: 0.2,
            //     // dropShadowBlur: 8,
            //     dropShadowColor: "white",
            //     dropShadowDistance: 0,
            //     fill: "white",
            //     fontFamily: "\"Lucida Console\", Monaco, monospace",
            //     align: "left"
            // });

            // const lbl = new PIXI.Text('碰', {...style, fontSize: 64});
            // lbl.anchor.set(.5, .5);
            // lbl.position.set(-400, -10);
            // tex.addChild(lbl);
        }

        // {
        //
        //     const tileRemaining = new PIXI.Text('剩餘 x3', {...style, fontSize: 32});
        //     this.stage.addChild(tileRemaining);
        //     tileRemaining.anchor.set(.5, .5);
        //     tileRemaining.position.set(256, 300);
        // }
        //
        // for (let i = 0; i < 4; i++) {
        //     const container = new PIXI.Container();
        //     container.pivot.set(.5);
        //     container.position.set(this.width / 2, this.height / 2);
        //     this.stage.addChild(container);
        //
        //     const bg = PIXI.Sprite.from(PIXI.Texture.WHITE);
        //     bg.anchor.set(.5);
        //     bg.position.set(0, 198);
        //     bg.width = this.width * .5;
        //     bg.height = this.height * .2;
        //     bg.tint = 0x000000;
        //     container.addChild(bg);
        //
        //     const dirBg = PIXI.Sprite.from(PIXI.Texture.WHITE);
        //     dirBg.anchor.set(.5);
        //     dirBg.position.set(-80, 198);
        //     dirBg.width = this.width * .12;
        //     dirBg.height = this.height * .12;
        //     dirBg.tint = i === 0 ? 0xff0000 : 0x110000;
        //     container.addChild(dirBg);
        //
        //     const dir = new PIXI.Text("東南西北"[i], {...style, fontSize: 42});
        //     dir.anchor.set(.5);
        //     dir.position.set(-80, 198);
        //     container.addChild(dir);
        //
        //     const score = new PIXI.Text('000000', {...style, fontSize: 38});
        //     score.anchor.set(.5);
        //     score.position.set(35, 198);
        //     container.addChild(score);
        //
        //     container.angle = i * -90;
        // }
    }

    draw() {
        this.renderer.reset();
        this.renderer.render(this.stage);
        this.texture.needsUpdate = true;
    }

    dispose() {
        this.stage.destroy();

        // TEMP Prevent "Too many active WebGL contexts" warning when dispose + init
        // lots of times (16+) with Next.JS fast reload during development
        // In future versions of PIXI this may be included in renderer.destroy function.
        // Then this line will not have to be manually called
        this.renderer.gl.getExtension("WEBGL_lose_context").loseContext();

        this.renderer.destroy();
        this.texture.dispose();
    }

}
