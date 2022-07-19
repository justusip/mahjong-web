import React, {useCallback, useEffect, useRef, useState} from "react";
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import {RoomEnvironment} from "three/examples/jsm/environments/RoomEnvironment";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {useResizeDetector} from "react-resize-detector";
import {OutlinePass} from "three/examples/jsm/postprocessing/OutlinePass";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";

export default function ThreeScene(props: {
    onStart: (renderer: THREE.WebGLRenderer, scene: THREE.Scene) => void,
}) {
    const onResize = useCallback((width: number, height: number) => {
        renderer.setSize(width, height, false);
        renderer.setPixelRatio(window.devicePixelRatio);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }, []);
    const {width, height, ref} = useResizeDetector({onResize});
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

        renderer = new THREE.WebGL1Renderer({canvas: ref.current});
        renderer.outputEncoding = THREE.sRGBEncoding;
        stats = Stats();

        ref.current.parentElement.appendChild(stats.dom);
        scene = new THREE.Scene();

        // scene.background = new THREE.Color(0x111111);
        scene.background = new THREE.Color(0xbfe3dd);
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.01).texture;

        // const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.2);
        // scene.add(ambientLight);

        const cameraPivot = new THREE.Group();
        cameraPivot.name = "cameraPivot";
        scene.add(cameraPivot);

        camera = new THREE.PerspectiveCamera(60, 1, 0.001, 1000);
        camera.layers.set(0);
        camera.position.set(0, .37, .22);
        camera.rotation.set(-70 / 180 * Math.PI, 0, 0);
        scene.add(camera);
        // cameraPivot.add(camera);
        const controls = new OrbitControls(camera, ref.current);
        // camera.rotation.set(-70 / 180 * Math.PI, 0, 0);

        const axesHelper = new THREE.AxesHelper(5);

        scene.add(axesHelper);
        props.onStart(renderer, scene);

        frameId = requestAnimationFrame(onRender);

    };

    const onUnmount = async () => {
        cancelAnimationFrame(frameId);
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

    return <canvas ref={ref} className={"block w-full h-full"}/>;
}
