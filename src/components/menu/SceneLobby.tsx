import React, {useEffect, useRef} from "react";
import * as THREE from "three";
import {Mesh, MeshStandardMaterial} from "three";
import {RoomEnvironment} from "three/examples/jsm/environments/RoomEnvironment";
import Stats from "three/examples/jsm/libs/stats.module";

import Resources from "../game/Resources";

export default function SceneLobby(): React.ReactElement {

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
        renderer = new THREE.WebGL1Renderer({canvas: canvas.current});
        // renderer.physicallyCorrectLights = true;
        renderer.outputEncoding = THREE.sRGBEncoding;
        // renderer.toneMapping = THREE.ReinhardToneMapping;
        // renderer.toneMappingExposure = 2;
        // renderer.shadowMap.enabled = true;
        // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        stats = Stats();
        canvas.current.parentElement.appendChild(stats.dom);

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

        camera = new THREE.PerspectiveCamera(40, 1, 0.001, 1000);
        scene.add(camera);
        camera.layers.set(0);
        camera.position.set(4.3, 1, 5);
        const deg2rad = Math.PI / 180;
        camera.rotation.y = 44 * deg2rad;

        // const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        // scene.add(ambientLight);
        // ambientLight.layers.enableAll();
        //
        // for (const pos of [[0, 2, 0], [4, 2, 0], [0, 2, 2], [4, 2, 4]]) {
        //     const light = new THREE.PointLight(0xffffff, .1, 1);
        //     light.position.set(pos[0], pos[1], pos[2]);
        //     light.castShadow = true;
        //     scene.add(light);
        // }

        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);
        // const controls = new OrbitControls(camera, canvas.current);

        const interior = Resources.getGLTF("models/interior.glb").scene.clone();
        scene.add(interior);

        interior.castShadow = true;
        interior.receiveShadow = true;
        interior.name = "interior";
        interior.position.set(0, 0, 0);
        interior.traverse(child => {
            if (!(child instanceof Mesh))
                return;
            const mesh = child as Mesh;
            const material = mesh.material as MeshStandardMaterial;
            if (!material)
                return;
            // if (material.name.includes("Emission")) {
            //     console.log(child);
            //     material.emissiveIntensity = 1;
            // }
        });

        const panda = Resources.getGLTF("models/panda.glb").scene.children[0];
        scene.add(panda);
        panda.position.set(3, 0, 2);
        panda.rotation.y = 30 * deg2rad;
        [
            "ExpSmile",
            "ExpNeutral",
            "ExpClosed",
            "ExpUwu",
        ].forEach((n, i) => {
            scene.getObjectByName(n).visible = i === 0;
        });
        mixer = new THREE.AnimationMixer(panda);
        const clips = Resources.getGLTF("models/panda.glb").animations;
        const clip = clips[0];
        const action = mixer.clipAction(clip);
        action.play();

        panda.receiveShadow = true;
        panda.castShadow = true;

        panda.traverse(child => {
            if (!(child instanceof Mesh))
                return;
            const mesh = child as Mesh;
            const material = mesh.material as MeshStandardMaterial;
            if (!material)
                return;
            child.receiveShadow = true;
            child.castShadow = true;
        });

        handleResize();
        window.addEventListener("resize", handleResize);

        frameId = requestAnimationFrame(onRender);
    };

    const end = async () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener("resize", handleResize);
    };

    const interval = 1 / 30 * 1000;
    let lastUpdate = 0;
    const onRender = () => {
        frameId = requestAnimationFrame(onRender);
        const curTime = performance.now();
        if (curTime > lastUpdate + interval) {
            lastUpdate = curTime;
            const delta = clock.getDelta();
            mixer.update(delta);
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

    return <canvas className="w-full h-screen bg-black" ref={canvas}/>;
}
