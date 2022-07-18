import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import {RoomEnvironment} from "three/examples/jsm/environments/RoomEnvironment";
import {Renderer, Scene} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export default function ThreeScene(props: {
    onStart: (scene: Scene, renderer: Renderer) => void,
}) {
    const parent = useRef<HTMLDivElement>();
    const canvas = useRef<HTMLCanvasElement>();
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;

    const clock = new THREE.Clock();
    let stats: Stats;
    let frameId: number;

    let camera: THREE.PerspectiveCamera;

    useEffect(() => {
        onMount().then();
        return () => {
            onUnmount().then();
        };
    }, []);

    const onMount = async () => {
        renderer = new THREE.WebGL1Renderer({canvas: canvas.current});
        renderer.outputEncoding = THREE.sRGBEncoding;

        stats = Stats();
        canvas.current!.parentElement!.appendChild(stats.dom);

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x111111);
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

        const cameraPivot = new THREE.Group();
        cameraPivot.name = "cameraPivot";
        scene.add(cameraPivot);

        camera = new THREE.PerspectiveCamera(80, 1, 0.001, 1000);
        cameraPivot.add(camera);
        camera.layers.set(0);
        camera.position.set(0, .35, .2);
        camera.rotation.set(-70 / 180 * Math.PI, 0, 0);
        // const controls = new OrbitControls(camera, canvas.current);

        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        onResize();
        window.addEventListener("resize", onResize);

        props.onStart(scene, renderer);

        frameId = requestAnimationFrame(onRender);

        //TODO this is for the inspector to work
    };

    const onUnmount = async () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener("resize", onResize);
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

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const onResize = () => {
        const parentWidth = parent.current.clientWidth;
        const parentHeight = parent.current.clientHeight;
        let w;
        let h;

        if (parentWidth > parentHeight * 16 / 9) {
            w = parentHeight * 16 / 9;
            h = parentHeight;
        } else {
            w = parentWidth;
            h = parentWidth * 9 / 16;
        }

        if (w !== width) {
            setWidth(w);
            setHeight(h);
        }
        renderer.setSize(w, h);
        renderer.setPixelRatio(window.devicePixelRatio);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    };

    return <div className={"w-screen h-screen bg-black flex"} ref={parent}>
        <canvas ref={canvas}
                className={"bg-neutral-800 rounded overflow-hidden m-auto"}
                style={{width: `${width}px`, height: `${height}px`}}/>
    </div>;
}
