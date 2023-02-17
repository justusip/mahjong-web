import React, {useCallback, useContext, useEffect} from "react";
import {useResizeDetector} from "react-resize-detector";
import * as THREE from "three";
import {Vector2} from "three";
import {RoomEnvironment} from "three/examples/jsm/environments/RoomEnvironment";
import Stats from "three/examples/jsm/libs/stats.module";

import Prompt from "./Prompt";
import {GameContext} from "../GameProvider";
import Aspect from "../generics/Aspect";

export default function SceneGame() {
    const ctx = useContext(GameContext);

    // const ref = React.useRef<HTMLCanvasElement>();
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let raycaster: THREE.Raycaster;

    const clock = new THREE.Clock();
    let stats: Stats;

    // let table: Table;
    let prompt: Prompt = null;

    const mousePos = new THREE.Vector2();

    const onResize = useCallback((width: number, height: number) => {
        if (!renderer || !camera)
            return;
        ref.current.width = width;
        ref.current.height = height;
        renderer.setSize(width, height, false);
        renderer.setPixelRatio(window.devicePixelRatio);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }, [camera, renderer]);
    const {width, height, ref} = useResizeDetector({onResize});

    useEffect(() => {
        if (!ref.current)
            return;
        const elem = ref.current as HTMLCanvasElement;
        const handlePointerEvent = (eventName: string) =>
            (e: PointerEvent) => {
                const rect = elem.getBoundingClientRect();
                mousePos.x = (e.clientX - rect.left) / rect.width;
                mousePos.y = (e.clientY - rect.top) / rect.height;
                raycaster.setFromCamera(new Vector2(mousePos.x * 2 - 1, -mousePos.y * 2 + 1), camera);
                const intersects = raycaster.intersectObjects([prompt], false);
                if (intersects.length > 0) {
                    const intersect = intersects.find(o => o.object === prompt);
                    if (intersect) {
                        const ev = new MouseEvent(eventName, {
                            bubbles: true,
                            cancelable: true,
                            clientX: intersect.uv.x * prompt.width,
                            clientY: prompt.height - (intersect.uv.y * prompt.height)
                        });
                        prompt.canvasElem.dispatchEvent(ev);
                    }
                }
            };
        const eventHandlers = ["pointermove", "pointerup", "pointerdown"]
            .map(o => ({name: o, handler: handlePointerEvent(o)}));
        eventHandlers.forEach(({name, handler}) => {
            elem.addEventListener(name, handler as (e: Event) => void);
        });
        return () => {
            eventHandlers.forEach(({name, handler}) => {
                elem.removeEventListener(name, handler as (e: Event) => void);
            });
        };
    }, [ref]);

    useEffect(() => {
        onStart();
        const updateInterval = 1 / 30 * 1000;
        let nextUpdate = 0;
        let frameId = 0;
        const loop = () => {
            frameId = requestAnimationFrame(loop);
            const curTime = performance.now();
            if (curTime > nextUpdate) {
                nextUpdate = curTime + updateInterval;
                onUpdate();
            }
        };
        frameId = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(frameId);
            onEnd();
        };
    }, []);

    const onStart = () => {
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

        raycaster = new THREE.Raycaster();

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
        // controls.target.set(0, -.06, 0);

        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        // Resources.getTexture("img/symbols.png").anisotropy = renderer.capabilities.getMaxAnisotropy();
        // Resources.getTexture("img/symbols.png").encoding = THREE.sRGBEncoding;

        onResize(width, height);

        //notifies the server that we have finished loading
        // ctx.socket.emit(Messages.GUK_READY_START);

        prompt = new Prompt(renderer.context);
        scene.add(prompt);
        prompt.position.set(0, 0.01, .16);
        prompt.rotation.x = -Math.PI / 2;
        prompt.init();

        // table = new Table(scene);
        // table.onInit();
        //
        // table.onRoomStart(0);
        // table.onReset([
        //         {
        //             hotbar: Tile.parseList("b2 b2 b2 b3 b4 b5"),
        //             melds: [
        //                 new Meld(MeldType.AmPung, ...Tile.parseList("a1 a2 a3")),
        //                 new Meld(MeldType.AmPung, ...Tile.parseList("a4 a5 a6"))
        //             ],
        //             flowers: Tile.parseList("w1")
        //         },
        //         {
        //             hotbar: Tile.parseList("b1 b1 b1 b2 b2 b2 b3 b4 b5"),
        //             melds: [
        //                 new Meld(MeldType.AmPung, ...Tile.parseList("a1 a2 a3"))
        //             ],
        //             flowers: Tile.parseList("w1")
        //         },
        //         {
        //             hotbar: Tile.parseList("a1 a2 a3 b1 b1 b1 b2 b2 b2 b3 b4 b5"),
        //             melds: [],
        //             flowers: []
        //         },
        //         {
        //             hotbar: Tile.parseList("b5"),
        //             melds: [
        //                 new Meld(MeldType.AmGong, ...Tile.parseList("a1 a2 a3 a4")),
        //                 new Meld(MeldType.AmGong, ...Tile.parseList("a1 a2 a3 a4")),
        //                 new Meld(MeldType.AmGong, ...Tile.parseList("a1 a2 a3 a4")),
        //                 new Meld(MeldType.AmGong, ...Tile.parseList("a1 a2 a3 a4")),
        //             ],
        //             flowers: Tile.parseList("w1")
        //         }
        //     ],
        //     0,
        //     0
        // );
    };

    const onUpdate = () => {
        prompt.draw();
        renderer.resetState();
        renderer.render(scene, camera);
        stats.update();
    };

    const onEnd = () => {
        prompt.dispose();
        renderer?.dispose();
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
    //                 table.onReset(gameStatus.players, event.fung, event.guk);
    //                 console.log(gameStatus);
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
    //     return () => {
    //         ctx.socket.off(Messages.ON_GAME_EVENT);
    //     };
    // }, []);

    return <Aspect aspect={16 / 9}>
        {/*<img className="absolute opacity-30 w-full" src="img/Screenshot 2022-07-20 at 9.20.33 PM.png"/>*/}
        <canvas ref={ref} className="block w-full h-full"/>
    </Aspect>;
}
