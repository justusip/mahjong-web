import * as Three from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer.js";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass.js";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass.js";
import {OutlinePass} from "three/examples/jsm/postprocessing/OutlinePass.js";
import {FXAAShader} from "three/examples/jsm/shaders/FXAAShader.js";

import Resources from "./Resources";
import Table from "./Table";
import Tile from "../mechanics/Tile";

export default class Room {
    pendingDiscard: boolean = false; //TODO

    renderer: Three.WebGLRenderer;
    composer: EffectComposer;
    scene: Three.Scene;
    raycaster: Three.Raycaster;
    camera: Three.PerspectiveCamera;
    selfCam: Three.PerspectiveCamera;
    // stats: Stats;
    frameId: number;

    outlinePass: OutlinePass;
    fxaaPass: ShaderPass;

    table: Table;

    ready = false;
    onReady: () => void;
    onDiscard: (tile: Tile) => void;
    onTextPosUpdate: (posX: number[], posY: number[]) => void;

    mosX: number;
    mosY: number;

    clock = new Three.Clock();
    hands: Three.Object3D[];
    mixers: Three.AnimationMixer[];

    async onStart(canvas: HTMLCanvasElement, selfPid: number) {
        this.renderer = new Three.WebGLRenderer({canvas: canva});
        this.renderer.physicallyCorrectLights = true;
        this.renderer.toneMapping = Three.ACESFilmicToneMapping;

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = Three.PCFSoftShadowMap;

        this.scene = new Three.Scene();
        this.raycaster = new Three.Raycaster();

        // this.stats = Stats();
        // canvas.parentElement.appendChild(this.stats.dom);

        const ambientLight = new Three.AmbientLight(0xffffff, 1);
        this.scene.add(ambientLight);
        ambientLight.layers.enableAll();

        const spotLight1 = new Three.SpotLight(0xffffff, 1);
        this.scene.add(spotLight1);
        spotLight1.position.set(0.011, 1.311, -0.784);
        spotLight1.castShadow = true;
        spotLight1.layers.enableAll();

        const spotLight2 = new Three.SpotLight(0xffffff, 1);
        this.scene.add(spotLight2);
        spotLight2.position.set(0.011, 0.460, 0.528);
        spotLight2.castShadow = true;
        spotLight2.layers.enableAll();

        this.camera = new Three.PerspectiveCamera(80, 1, 0.001, 1000);
        this.scene.add(this.camera);
        this.camera.layers.set(0);
        // this.camera.position.set(0, .45, .3);
        // this.camera.rotation.set(-Math.PI * .35, 0, 0);
        this.camera.position.set(0, .45, .4);
        this.camera.rotation.set(-60 / 180 * Math.PI, 0, 0);
        const controls = new OrbitControls(this.camera, canvas);

        this.selfCam = new Three.PerspectiveCamera(60, 1, 0.001, 1000);
        this.scene.add(this.selfCam);
        this.selfCam.layers.set(1);
        this.selfCam.position.set(0, .18, .6);
        this.selfCam.rotation.set(0, 0, 0);

        this.table = new Table(this);
        this.table.construct(selfPid);

        this.composer = new EffectComposer(this.renderer);
        this.composer.renderTarget1.texture.encoding = Three.sRGBEncoding;
        this.composer.renderTarget2.texture.encoding = Three.sRGBEncoding;

        const camPass = new RenderPass(this.scene, this.camera);
        camPass.clearDepth = false;
        this.composer.addPass(camPass);

        const selfCamPass = new RenderPass(this.scene, this.selfCam);
        selfCamPass.clear = false;
        selfCamPass.clearDepth = true;
        this.composer.addPass(selfCamPass);

        this.fxaaPass = new ShaderPass(FXAAShader);
        this.composer.addPass(this.fxaaPass);

        this.outlinePass = new OutlinePass(new Three.Vector2(1, 1), this.scene, this.selfCam);
        this.outlinePass.visibleEdgeColor = new Three.Color("yellow");
        this.composer.addPass(this.outlinePass);

        Resources.getTexture("img/symbols.png").anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        Resources.getTexture("img/symbols.png").encoding = Three.sRGBEncoding;
        ((Resources.getGLTF("models/tile.glb").scene.children[0] as Three.Mesh).material as Three.MeshStandardMaterial).map.encoding = Three.sRGBEncoding;
        this.table.tableObj.children.filter(o => o.name.startsWith("Cube")).forEach(o => {
            const mesh = <Three.Mesh>o;
            const mat = <Three.MeshStandardMaterial>mesh.material;
            if (mat.map !== null) {
                mat.map.minFilter = Three.LinearFilter;
                mat.map.magFilter = Three.LinearFilter;
                mat.map.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
                mat.map.encoding = Three.sRGBEncoding;
            }
            mesh.receiveShadow = true;
        });

        for (let i = 0; i < 4; i++) {
            const mesh = this.table.tableObj.children.filter(o => o.name.startsWith("Display"))[i].children[7] as Three.Mesh;
            const mat = <Three.MeshStandardMaterial>mesh.material;
            if (mat.map !== null) {
                mat.map.minFilter = Three.LinearMipMapLinearFilter;
                mat.map.magFilter = Three.LinearFilter;
                mat.map.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
                mat.map.encoding = Three.sRGBEncoding;
            }

        }

        window.addEventListener("mousemove", this.onMouseMove);
        window.addEventListener("mousedown", this.onMouseDown);
        this.onResize();
        window.addEventListener("resize", this.onResize);
        this.frameId = requestAnimationFrame(this.onUpdate);

        this.hands = [];
        this.mixers = [];
        for (let i = 0; i < 4; i++) {
            const handContainer = new Three.Group();
            this.scene.add(handContainer);
            handContainer.rotation.set(0, Math.PI / 2 * i, 0);

            const hand = Resources.cloneGLTF("models/arm.glb").scene as Three.Object3D;
            handContainer.add(hand);
            this.hands.push(hand);
            hand.position.set(.1, .06, .7);

            this.mixers.push(new Three.AnimationMixer(hand));
        }

        for (let i = 0; i < 4; i++) {
            const group = new Three.Group();
            this.scene.add(group);

            const geometry = new Three.PlaneGeometry(1, 1);
            const material = new Three.MeshBasicMaterial({color: 0x000000, side: Three.FrontSide});
            const plane = new Three.Mesh(geometry, material);
            plane.position.set(0, 0, -.5);
            group.add(plane);
            group.rotation.set(0, i * .5 * Math.PI, 0);
        }

        await new Promise<void>(r => this.onReady = r);
    }

    onReset() {
        // for (let i = 0; i < 20; i++) {
        //     const tileObj = TileForge.spawnTile();
        //     this.table.discardContainers[1].add(tileObj);
        //     this.table.claimDiscardPos(1, tileObj);
        // }
        this.onResize();
        this.hands.forEach((h, i) => h.parent.rotation.set(0, -this.table.selfPid * 90 / 180 * Math.PI + Math.PI / 2 * i, 0));
    }

    onUpdate = () => {
        this.frameId = requestAnimationFrame(this.onUpdate);
        // this.stats.begin();
        this.checkMouseHover();
        const delta = this.clock.getDelta();
        for (let mixer of this.mixers) {
            if (mixer != null)
                mixer.update(delta);
        }
        this.composer.render();
        // this.stats.end();
        if (!this.ready) {
            this.ready = true;
            this.onReady();
        }
    };

    stop() {
        cancelAnimationFrame(this.frameId);
        window.removeEventListener("resize", this.onResize);
        window.removeEventListener("mousemove", this.onMouseMove);
        window.removeEventListener("mousedown", this.onMouseDown);
        document.body.style["cursor"] = null;
    }

    onResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.composer.setSize(width, height);
        this.composer.setPixelRatio(window.devicePixelRatio);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.selfCam.aspect = width / height;
        this.selfCam.updateProjectionMatrix();
        this.fxaaPass.uniforms["resolution"].value.set(
            1 / (width * window.devicePixelRatio),
            1 / (height * window.devicePixelRatio)
        );
        this.outlinePass.resolution = new Three.Vector2(width, height);

        if (this.onTextPosUpdate != null) {
            const pos = this.table.namePos.map(p => this.worldToScreen(p));
            this.onTextPosUpdate(pos.map(p => p.x), pos.map(p => p.y));
        }
    };

    onMouseMove = (e: MouseEvent) => {
        this.mosX = (e.clientX / window.innerWidth) * 2 - 1;
        this.mosY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    checkMouseHover() {
        if (this.table.drewContainers === undefined || this.table.ownedContainers === undefined)
            return;
        this.raycaster.setFromCamera(new Three.Vector2(this.mosX, this.mosY), this.selfCam);
        this.raycaster.layers.enable(1);
        const tray = [...this.table.drewContainers[this.table.selfPid].children, ...this.table.ownedContainers[this.table.selfPid].children];
        const intersects = this.raycaster.intersectObjects(tray);
        if (intersects.length === 0) {
            document.body.style["cursor"] = "default";
            this.outlinePass.selectedObjects = [];
        } else {
            if (this.pendingDiscard) {
                document.body.style["cursor"] = "pointer";
                this.outlinePass.selectedObjects = [intersects[0].object];
            } else {
                document.body.style["cursor"] = "not-allowed";
                this.outlinePass.selectedObjects = [];
            }
        }
    }

    onMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        // if (!this.pendingDiscard)
        //     return;
        this.raycaster.setFromCamera(new Three.Vector2(this.mosX, this.mosY), this.selfCam);
        this.raycaster.layers.set(1);
        const tray = [...this.table.drewContainers[this.table.selfPid].children, ...this.table.ownedContainers[this.table.selfPid].children];
        const intersects = this.raycaster.intersectObjects(tray);
        if (intersects.length === 0)
            return;

        const tileObj = intersects[0].object;
        this.onDiscard(tileObj.userData.tile);
    };

    setOnDiscard(onDiscard: (tile: Tile) => void) {
        this.onDiscard = onDiscard;
    }

    setOnTextPosUpdate(onTextPosUpdate: (posX: number[], posY: number[]) => void) {
        this.onTextPosUpdate = onTextPosUpdate;
    }

    worldToScreen(pos: Three.Vector3): Three.Vector2 {
        const widthHalf = window.innerWidth / 2;
        const heightHalf = window.innerHeight / 2;

        const screenPos = pos.clone();
        screenPos.project(this.camera);
        return new Three.Vector2(
            (screenPos.x * widthHalf) + widthHalf,
            -(screenPos.y * heightHalf) + heightHalf
        );
    }

}
