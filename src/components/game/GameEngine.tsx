import * as THREE from "three";
import {RoomEnvironment} from "three/examples/jsm/environments/RoomEnvironment";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

import Animator from "./Animator";
import Resources from "./Resources";
import TileForge from "./TileForge";
import {Socket} from "socket.io-client";
import EventType from "@/events/EventType";
import EventListener from "@/events/EventListener";
import GameSyncEvent from "@/events/GameSyncEvent";
import Event from "@/events/Event";

export default class GameEngine extends EventListener {

    canvas: HTMLCanvasElement | null = null;
    socket: Socket;

    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;

    // clock = new THREE.Clock();
    // stats: Stats;

    table: THREE.Object3D;
    animators: Animator[] = [];

    raycaster = new THREE.Raycaster();
    prevMousePos: THREE.Vector2 | null = null;
    mousePos: THREE.Vector2 | null = null;
    curIntersectedTileObj: THREE.Object3D | null = null;

    selfSeatingId: number | null = null;
    myUUID = "0a2f2e15-bd30-4613-bde5-ad4f81f84dc3"; //TODO hardcoded currently

    constructor(canvas: HTMLCanvasElement) {
        super();
        this.canvas = canvas;
    }

    onStart() {
        console.log("onStart");

        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true});
        // this.renderer.outputEncoding = THREE.sRGBEncoding;

        // this.stats = new Stats();
        // this.canvas.parentElement.appendChild(this.stats.dom);

        this.scene = new THREE.Scene();
        // this.scene.background = new THREE.Color(0xbfe3dd);
        this.scene.background = new THREE.Color(0);
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), .01).texture;

        const ambientLight = new THREE.AmbientLight(0xFFFFFF, .2);
        this.scene.add(ambientLight);
        const light = new THREE.PointLight(0xFFFFFF, .2);
        light.position.set(0, .1, 0);
        this.scene.add(light);
        const l1 = new THREE.PointLight(0xFFFFFF, .2);
        l1.position.set(0, .1, .5);
        this.scene.add(l1);

        const cameraPivot = new THREE.Group();
        cameraPivot.name = "cameraPivot";
        this.scene.add(cameraPivot);

        this.camera = new THREE.PerspectiveCamera(27, 1, 0.001, 1000);
        this.camera.layers.set(0);
        this.camera.position.set(0, 0.68, 0.73);
        this.camera.rotation.set(-45 / 180 * Math.PI, 0, 0);
        this.scene.add(this.camera);

        // const controls = new OrbitControls(this.camera, this.canvas);
        // controls.target.set(0, -.06, 0);

        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);

        // Resources.getTexture("img/symbols.png").anisotropy = renderer.capabilities.getMaxAnisotropy();
        // Resources.getTexture("img/symbols.png").encoding = THREE.sRGBEncoding;

        this.onResize(window.innerWidth, window.innerHeight);

        this.table = Resources.getGLTF("models/table.glb").scene.children.find(o => o.name === "Table").clone();
        this.scene.add(this.table);
        this.table.receiveShadow = true;
        this.table.name = "table";

        for (let seatingId = 0; seatingId < 4; seatingId++) {
            const animator = new Animator(this.table, seatingId);
            this.animators.push(animator);
        }

        // this.setSampleState();

        // Indicate that we are ready to start a new Guk. The server can then start shuffling and distributing the tiles.
        // TODO onStart may be called in the middle of the match (React remount of component / debug reload), but this should only be called before the Guk start.
        this.socket.emit(EventType.DECIDE_READY);

        // After the server has shuffled the tiles, request the server to fetch my inventory.
        this.socket.emit(EventType.REQUEST_GAME_SYNC);
    }

    onUpdate(deltaTime: number) {
        if (this.selfSeatingId !== null) {
            if (this.mousePos && this.mousePos != this.prevMousePos) {
                this.raycaster.setFromCamera(this.mousePos, this.camera);
                const intersects = this.raycaster.intersectObjects(this.animators[this.selfSeatingId].container.children, false);
                this.curIntersectedTileObj = null;
                for (const intersect of intersects) {
                    const obj = intersect.object;
                    if (obj.userData.tile && (obj.userData.type === 0 || obj.userData.type === 1)) {
                        this.curIntersectedTileObj = obj;
                        break;
                    }
                }
                this.prevMousePos = this.mousePos;
            }

            this.animators[this.selfSeatingId].container.traverse(obj => {
                if (!obj.userData.tile)
                    return;
                TileForge.setSelected(obj, this.curIntersectedTileObj == obj);
            });
        }
        document.body.style["cursor"] = this.curIntersectedTileObj ? "pointer" : null;

        this.renderer.render(this.scene, this.camera);
        // this.stats.update();
    }

    onEnd() {
        console.log("onEnd");
        this.renderer?.dispose();
    }

    onResize(width: number, height: number) {
        if (!width || !height)
            return;
        this.canvas.width = width;
        this.canvas.height = height;
        this.renderer.setSize(width, height, false);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.camera.aspect = width / height;

        const aspect = width / height;
        // default: 27
        this.camera.fov = 11 + 35 / Math.min(aspect, 2);

        this.camera.updateProjectionMatrix();
    }

    onPointerMove(posX: number, posY: number) {
        this.mousePos = new THREE.Vector2(posX, posY);
    }

    onPointerDown() {
        if (this.curIntersectedTileObj) {
            console.log(`Clicked on: [${this.curIntersectedTileObj.userData.tile.toString()}].`);
            this.socket.emit(EventType.DECIDE_DISCARD, this.curIntersectedTileObj.userData.tile.serialize());
        }
    }

    override regSocket(socket: Socket) {
        this.socket = socket;
        super.regSocket(socket);
    }

    setSampleState() {
        this.onGameSync(GameSyncEvent.sample());
    }

    override onGameSync(e: GameSyncEvent) {
        this.selfSeatingId = e.players.findIndex(p => p.uuid === this.myUUID);
        console.log(`SeatingID: ${this.selfSeatingId}`);
        for (const animator of this.animators) {
            animator.setClientSeatingId(this.selfSeatingId);
        }
        super.onGameSync(e);
    }

    override onEvent(e: Event) {
        super.onEvent(e);
        for (const animator of this.animators) {
            animator.onEvent(e);
        }
    }

}