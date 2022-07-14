import React, {useEffect, useRef} from "react";
import * as THREE from "three";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import Stats from "three/examples/jsm/libs/stats.module";
import {SSAOPass} from "three/examples/jsm/postprocessing/SSAOPass";
import {Material, Mesh, MeshStandardMaterial} from "three";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
import GUI from "lil-gui";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {FXAAShader} from "three/examples/jsm/shaders/FXAAShader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {RoomEnvironment} from "three/examples/jsm/environments/RoomEnvironment";
import Resources from "../../game/graphics/Resources";

export default function SceneGame(): React.ReactElement {

    const canvas = useRef<HTMLCanvasElement>();
    const clock = new THREE.Clock();
    let renderer: THREE.WebGLRenderer;
    let mixer: THREE.AnimationMixer;
    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let stats: Stats;
    let frameId: number;

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
        canvas.current.parentElement.appendChild(stats.dom);

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
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
        // const controls = new OrbitControls(camera, canvas.current);

        const table = Resources.getGLTF("models/table.glb").scene.clone();
        scene.add(table);
        table.name = "table";

        handleResize();
        window.addEventListener("resize", handleResize);

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

    return <div className={"w-full h-screen bg-black"}>
        {/*<canvas className={"w-[500px] h-[200px] aspect-square rounded overflow-hidden"} ref={canvas}/>*/}
        <canvas ref={canvas}/>
    </div>;
}
