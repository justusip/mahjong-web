import React, {useEffect, useRef} from "react";
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import {RoomEnvironment} from "three/examples/jsm/environments/RoomEnvironment";
import Resources from "../../game/graphics/Resources";
import TileForge from "../../game/graphics/TileForge";
import * as Three from "three";
import Meld from "../../generics/Meld";
import Tile from "../../generics/Tile";

export default function SceneGame(props: {

}): React.ReactElement {

    const canvas = useRef<HTMLCanvasElement>();
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;

    const clock = new THREE.Clock();
    let stats: Stats;
    let frameId: number;

    let camera: THREE.PerspectiveCamera;
    let table: THREE.Object3D;

    let mixer: THREE.AnimationMixer;

    useEffect(() => {
        init().then();
        return function onUnMount() {
            end().then();
        };
    }, []);

    const init = async () => {
        await Resources.load();

        renderer = new THREE.WebGL1Renderer({canvas: canvas.current});
        renderer.outputEncoding = THREE.sRGBEncoding;

        stats = Stats();
        canvas.current!.parentElement!.appendChild(stats.dom);

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        // scene.background = new THREE.Color(0xffffff);
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

        camera = new THREE.PerspectiveCamera(80, 1, 0.001, 1000);
        scene.add(camera);
        camera.layers.set(0);
        camera.position.set(0, .35, .23);
        camera.rotation.set(-70 / 180 * Math.PI, 0, 0);
        // const controls = new OrbitControls(camera, canvas.current);

        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        table = Resources.getGLTF("models/table.glb").scene.children[0].clone();
        scene.add(table);
        table.name = "table";

        handleResize();
        window.addEventListener("resize", handleResize);

        hardReset(); //todo

        frameId = requestAnimationFrame(onRender);
    };

    const end = async () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener("resize", handleResize);
    };

    let interval = 1 / 30 * 1000;
    let lastUpdate = 0;
    const onRender = () => {
        frameId = requestAnimationFrame(onRender);
        const curTime = performance.now();
        if (curTime > lastUpdate + interval) {
            lastUpdate = curTime;
            const delta = clock.getDelta();
            renderer.render(scene, camera);
            stats.update();
        }
    };

    const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };

    const map = <T, >(n: number, predicate: (n: number) => T): T[] => [...Array(n)].map((_, i) => predicate(i));

    const hardReset = () => {
        table.remove(...table.children.filter(o => o.type === "Group"));
        let containers = [...Array(4)].map((_, i) => {
            const container = new THREE.Group();
            table.add(container);
            container.rotation.set(0, Math.PI / 2 * i, 0);
            return container;
        });

        const ownPos = map(13, i => new Three.Vector3((-13 / 2 - .25 + i) * 0.026, .03, .3));
        const drewPos = new Three.Vector3((13 / 2 + .25) * 0.026, .03, .3);
        const discardPos = map(24, i => {
            const x = i % 6;
            const y = Math.floor(i / 6);
            return new Three.Vector3((-5 / 2 + x) * 0.026, .024, .098 + y * 0.036);
        });
        const cornerPos = map(24, i => new Three.Vector3(-.205 + i * 0.026, .024, .245));

        const tile = TileForge.spawnTile();
        containers[0].add(tile);
        tile.position.copy(ownPos[0]);
    };

    return <div className={"w-full h-screen bg-black overflow-hidden"}>
        <canvas ref={canvas}/>
    </div>;
}
