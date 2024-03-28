import ThreeReactElement from "./ThreeReactElement";
import {Socket} from "socket.io-client";
import * as THREE from "three";
import {Vector2} from "three";
import Animator from "./Animator";
import {RoomEnvironment} from "three/examples/jsm/environments/RoomEnvironment";
import Resources from "./Resources";
import TileForge from "./TileForge";
import Tile from "@/types/Tile";
import Meld, {MeldType} from "@/types/Meld";

export default class AppTest extends ThreeReactElement {

    socket: Socket;

    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;

    clock = new THREE.Clock();

    table: THREE.Object3D;
    animators: Animator[] = [];

    raycaster = new THREE.Raycaster();
    prevMousePos: THREE.Vector2 | null = null;
    mousePos: THREE.Vector2 | null = null;
    curIntersectedTileObj: THREE.Object3D | null = null;

    selfPid = 0;

    override onStart(): void {
        console.log("AppTest.onStart");

        this.renderer = new THREE.WebGLRenderer({canvas: this.state.canvasRef.current, antialias: true});
        // this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.scene = new THREE.Scene();
        // this.scene.background = new THREE.Color(0xbfe3dd);
        this.scene.background = new THREE.Color(0);
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), .01).texture;

        const ambientLight = new THREE.AmbientLight(0xFFFFFF, .2);
        this.scene.add(ambientLight);
        const light = new THREE.PointLight(0xFFFFFF, .5);
        light.position.set(0, .1, 0);
        this.scene.add(light);
        const l1 = new THREE.PointLight(0xFFFFFF, .5);
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

        // const controls = new OrbitControls(camera, ref.current);
        // controls.target.set(0, -.06, 0);

        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);

        // Resources.getTexture("img/symbols.png").anisotropy = renderer.capabilities.getMaxAnisotropy();
        // Resources.getTexture("img/symbols.png").encoding = THREE.sRGBEncoding;

        this.table = Resources.getGLTF("models/table.glb").scene.children.find(o => o.name === "Table").clone();
        this.scene.add(this.table);
        this.table.receiveShadow = true;
        this.table.name = "table";

        for (let pid = 0; pid < 4; pid++) {
            const animator = new Animator(this.table, this.selfPid, pid);
            this.animators.push(animator);
        }

        this.setSampleState();
    }

    setSampleState() {
        const gameState = new GameState(
            0,
            0,
            [...Array(4)].map(() => ({
                wall: Tile.parseList("b2 b2 b2 b3 b4 b5"),
                drew: Tile.parse("b2"),
                melds: [
                    new Meld(MeldType.MingGong, 1, Tile.parseList("a1 a1 a1 a1")),
                    new Meld(MeldType.MingSoeng, 1, Tile.parseList("a4 a5 a6"))
                ],
                flowers: Tile.parseList("w1 w2 w3 w4 w5 w6 w7 w8"),
                discards: Tile.parseList("c2 c3 c4 c8 c1 d2 d6 d8 d1 a1 a4 a6 a2 b2 b3"),
                hasLichi: false
            })),
            0
        );
        this.setGameState(gameState);
    }

    setGameState(gameState: GameState) {
        for (const animator of this.animators)
            animator.onGameSync(gameState);
    }

    override onUpdate(): void {
        console.log("AppTest.onUpdate");

        this.onRoutineResizeCheck(this.state.width, this.state.height);

        this.mousePos = new Vector2(this.state.mosX, this.state.mosY);
        if (this.mousePos && this.mousePos != this.prevMousePos) {
            this.raycaster.setFromCamera({x: this.mousePos.x, y: this.mousePos.y}, this.camera);
            const intersects = this.raycaster.intersectObjects(this.animators[0].container.children, false);
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

        this.animators[0].container.traverse(obj => {
            if (!obj.userData.tile)
                return;
            TileForge.setSelected(obj, this.curIntersectedTileObj == obj);
        });
        document.body.style["cursor"] = this.curIntersectedTileObj ? "pointer" : null;

        this.renderer.render(this.scene, this.camera);
    }

    onRoutineResizeCheck(width: number, height: number): void {
        if (!width || !height)
            return;
        this.renderer.setSize(width, height, false);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.camera.aspect = width / height;

        const aspect = width / height;
        // default: 27
        this.camera.fov = 11 + 35 / Math.min(aspect, 2);

        this.camera.updateProjectionMatrix();
    }

    override onEnd(): void {
        console.log("AppTest.onEnd");
    }

}