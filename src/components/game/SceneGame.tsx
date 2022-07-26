import * as PIXI from "pixi.js";
import React, {useCallback, useContext, useEffect} from "react";
import {useResizeDetector} from "react-resize-detector";
import * as THREE from "three";
import {RoomEnvironment} from "three/examples/jsm/environments/RoomEnvironment";
import Stats from "three/examples/jsm/libs/stats.module";

import Resources from "./Resources";
import Table from "./Table";
import {GameContext} from "../GameProvider";
import Aspect from "../generics/Aspect";
import Meld, {MeldType} from "../../types/Meld";
import Tile from "../../types/Tile";

export default function SceneGame() {
    const ctx = useContext(GameContext);

    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    const clock = new THREE.Clock();

    let stats: Stats;
    let frameId: number;
    let camera: THREE.PerspectiveCamera;

    let table: Table;

    let pixiRenderer: PIXI.Renderer;
    let pixiStage: PIXI.Container;

    const onResize = useCallback((width: number, height: number) => {
        renderer.setSize(width, height, false);
        renderer.setPixelRatio(window.devicePixelRatio);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        pixiRenderer.resize(width, height);
        pixiRenderer.resolution = window.devicePixelRatio;
        pixiStage.width = 1280;
        pixiStage.height = 720;
        pixiStage.scale.set(width / 1280);
    }, [camera, pixiRenderer, renderer]);
    const {width, height, ref} = useResizeDetector({onResize});

    useEffect(() => {
        onMount().then();
        return () => {
            onUnmount().then();
        };
    }, []);

    const onMount = async () => {
        renderer = new THREE.WebGLRenderer({canvas: ref.current, antialias: true});
        renderer.outputEncoding = THREE.sRGBEncoding;
        stats = Stats();

        ref.current.parentElement.appendChild(stats.dom);
        scene = new THREE.Scene();

        scene.background = new THREE.Color(0xbfe3dd);
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.01).texture;

        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
        scene.add(ambientLight);

        const light = new THREE.PointLight(0xFFFFFF, 1.5);
        light.position.set(0, .1, 0);
        scene.add(light);

        const cameraPivot = new THREE.Group();
        cameraPivot.name = "cameraPivot";
        scene.add(cameraPivot);

        // const gui = new GUI();
        // const params = {
        //     fov: 27,
        //     y: 0.68,
        //     z: 0.73,
        //     rot: -45
        // };
        // gui.add(params, "fov", 0, 100).onChange((v: number) => {
        //     camera.fov = v;
        //     camera.updateProjectionMatrix();
        // });
        // gui.add(params, "y", 0, 2).onChange((v: number) => camera.position.y = v);
        // gui.add(params, "z", 0, 2).onChange((v: number) => camera.position.z = v);
        // gui.add(params, "rot", -180, 0).onChange((v: number) => camera.rotation.x = v * Math.PI / 180);

        camera = new THREE.PerspectiveCamera(27, 1, 0.001, 1000);
        camera.layers.set(0);
        camera.position.set(0, 0.68, 0.73);
        camera.rotation.set(-45 / 180 * Math.PI, 0, 0);
        scene.add(camera);
        // cameraPivot.add(camera);
        // const controls = new OrbitControls(camera, ref.current);

        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        Resources.getTexture("img/symbols.png").anisotropy = renderer.capabilities.getMaxAnisotropy();
        Resources.getTexture("img/symbols.png").encoding = THREE.sRGBEncoding;

        pixiRenderer = new PIXI.Renderer({
            width,
            height,
            backgroundAlpha: 0,
            view: ref.current,
            context: ref.current.context,
            resolution: window.devicePixelRatio
        });

        pixiStage = new PIXI.Container();
        pixiStage.width = 1280;
        pixiStage.height = 720;
        pixiStage.scale.set(width / 1280);
        const w = 1280;
        const h = 720;

        const guk = new PIXI.Text('Mazoria-Client v0.?', {
            fontFamily: "monospace",
            fontSize: 16,
            fill: "#ffffff"
        });
        guk.anchor.set(0);
        pixiStage.addChild(guk);

        for (let i = 0; i < 13; i++) {
            const tile = PIXI.Sprite.from(`img/tiles/tile_${0}_${0}.png`);
            tile.scale.set(.25);
            tile.anchor.set(.5, 1);
            tile.position.set(w / 2 + 65 * (-7 + i), h);
            tile.interactive = true;
            tile.tint = 0xeeeeee;
            tile.on("pointerover", function (this: PIXI.Sprite) {
                ref.current.style["cursor"] = "pointer";
                this.tint = 0xffffff;
            });
            tile.on("pointerdown", function (this: PIXI.Sprite) {
                this.tint = 0xdddddd;
            });
            tile.on("pointerup", function (this: PIXI.Sprite) {
                this.tint = 0xffffff;
            });
            tile.on("pointerout", function (this: PIXI.Sprite) {
                ref.current.style["cursor"] = null;
                this.tint = 0xeeeeee;
            });
            pixiStage.addChild(tile);
        }

        for (let i = 0; i < 4; i++) {
            const names = [
                "超級無敵飛天少女",
                "as",
                "ass8287",
                "assyabyes"
            ];
            const name = new PIXI.Text(names[i], {fill: "white", fontFamily: "Verdana", fontSize: 16});
            name.anchor.set(.5);
            const pos = [
                [240, 580], //front
                [1280 - 250, 360], //right
                [900, 80], //back
                [250, 360], //left
            ];
            name.position.set(...pos[i]);

            const nameBg = new PIXI.Sprite(PIXI.Texture.WHITE);
            nameBg.tint = 0;
            nameBg.alpha = .5;
            nameBg.width = name.width + 8;
            nameBg.height = name.height + 8;
            nameBg.anchor.set(.5);
            nameBg.position.set(...pos[i]);
            pixiStage.addChild(nameBg);

            pixiStage.addChild(name);
        }

        const btnsPanel = new PIXI.Sprite(PIXI.Texture.WHITE);
        btnsPanel.anchor.set(.5);
        btnsPanel.position.set(1280 / 2, 580);
        btnsPanel.width = 600;
        btnsPanel.height = 60;
        pixiStage.addChild(btnsPanel);

        onResize(width, height);

        onStart();
        frameId = requestAnimationFrame(onRender);
    };

    const onUnmount = async () => {
        cancelAnimationFrame(frameId);
    };

    const onStart = async () => {
        table = new Table(scene);
        table.onInit();

        table.onRoomStart(0);
        table.onSetState([
                {
                    hotbar: Tile.parseList("b2 b2 b2 b3 b4 b5"),
                    melds: [
                        new Meld(MeldType.AmPung, ...Tile.parseList("a1 a2 a3")),
                        new Meld(MeldType.AmPung, ...Tile.parseList("a4 a5 a6"))
                    ],
                    flowers: Tile.parseList("w1")
                },
                {
                    hotbar: Tile.parseList("b1 b1 b1 b2 b2 b2 b3 b4 b5"),
                    melds: [
                        new Meld(MeldType.AmPung, ...Tile.parseList("a1 a2 a3"))
                    ],
                    flowers: Tile.parseList("w1")
                },
                {
                    hotbar: Tile.parseList("a1 a2 a3 b1 b1 b1 b2 b2 b2 b3 b4 b5"),
                    melds: [],
                    flowers: []
                },
                {
                    hotbar: Tile.parseList("b5"),
                    melds: [
                        new Meld(MeldType.AmGong, ...Tile.parseList("a1 a2 a3 a4")),
                        new Meld(MeldType.AmGong, ...Tile.parseList("a1 a2 a3 a4")),
                        new Meld(MeldType.AmGong, ...Tile.parseList("a1 a2 a3 a4")),
                        new Meld(MeldType.AmGong, ...Tile.parseList("a1 a2 a3 a4")),
                    ],
                    flowers: Tile.parseList("w1")
                }
            ],
            0,
            0
        );
    };

    const interval = 1 / 30 * 1000;
    let nextUpdate = 0;
    const onRender = () => {
        frameId = requestAnimationFrame(onRender);
        const curTime = performance.now();
        if (curTime > nextUpdate) {
            nextUpdate = curTime + interval;
            const delta = clock.getDelta();
            renderer.resetState();
            renderer.render(scene, camera);
            pixiRenderer.reset();
            pixiRenderer.render(pixiStage, {clear: false});
            stats.update();
        }
    };

    // useEffect(() => {
    //     ctx.socket.on(Messages.ON_GAME_EVENT, (
    //         id: number,
    //         gs: any,
    //         eventType: GameEventType,
    //         data: any
    //     ) => {
    //         const gameStatus = GameStatus.deserialize(gs);
    //         switch (eventType) {
    //             case GameEventType.START: {
    //                 const event = GukStartEvent.deserialize(data);
    //                 table.onResetTable(gameStatus.players)
    //                 break;
    //             }
    //             case GameEventType.DREW: {
    //                 const event = DrewEvent.deserialize(data);
    //                 break;
    //             }
    //             case GameEventType.DISCARD: {
    //                 const event = DiscardEvent.deserialize(data);
    //                 break;
    //             }
    //             case GameEventType.MERGE: {
    //                 const event = MergeEvent.deserialize(data);
    //                 break;
    //             }
    //             case GameEventType.END: {
    //                 const event = GukEndEvent.deserialize(data);
    //                 break;
    //             }
    //         }
    //     });
    // });

    return <Aspect aspect={16 / 9}>
        {/*<img className={"absolute opacity-30 w-full"} src={"img/Screenshot 2022-07-20 at 9.20.33 PM.png"}/>*/}
        <canvas ref={ref} className="block w-full h-full"/>
    </Aspect>;
}
