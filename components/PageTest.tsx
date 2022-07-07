import React, {useEffect, useRef} from "react";
import * as Three from "three";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import Resources from "../game/graphics/Resources";
import Stats from "three/examples/jsm/libs/stats.module";
import {SSAOPass} from "three/examples/jsm/postprocessing/SSAOPass";
import {Material, Mesh, MeshStandardMaterial} from "three";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
import GUI from "lil-gui";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {FXAAShader} from "three/examples/jsm/shaders/FXAAShader";

export default function owo(): React.ReactElement {

    const canvas = useRef<HTMLCanvasElement>();
    let renderer: Three.WebGLRenderer;
    let camera: Three.PerspectiveCamera;
    let scene: Three.Scene;
    let stats: Stats;
    let frameId: number;

    let composer: EffectComposer;

    useEffect(() => {
        init().then();
        return function onUnMount() {
            end().then();
        };
    }, []);

    const init = async () => {
        await Resources.load();

        renderer = new Three.WebGLRenderer({canvas: canvas.current});
        renderer.physicallyCorrectLights = true;
        renderer.outputEncoding = Three.sRGBEncoding;
        renderer.toneMapping = Three.ReinhardToneMapping;
        renderer.toneMappingExposure = 3;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = Three.PCFSoftShadowMap;

        stats = Stats();
        canvas.current.parentElement.appendChild(stats.dom);

        scene = new Three.Scene();

        camera = new Three.PerspectiveCamera(40, 1, 0.001, 1000);
        scene.add(camera);
        camera.layers.set(0);
        // camera.position.set(0, .45, .3);
        // camera.rotation.set(-Math.PI * .35, 0, 0);
        camera.position.set(4.5, 1.7, 5);
        camera.rotation.set(-.14, 0.8, 0.1);

        const ambientLight = new Three.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);
        ambientLight.layers.enableAll();

        for (const pos of [[0, 2, 0], [4, 2, 0], [0, 2, 2], [4, 2, 4]]) {
            const light = new Three.PointLight(0xffffff, 5, 100);
            light.position.set(pos[0], pos[1], pos[2]);
            light.castShadow = true;
            scene.add(light);
        }

        const axesHelper = new Three.AxesHelper(5);
        scene.add(axesHelper);
        // const controls = new OrbitControls(camera, canvas.current);

        const interior = Resources.getGLTF("models/interior.glb").scene.clone();
        scene.add(interior);

        console.log(interior);
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
            if (material.name.includes("Emission")) {
                console.log(child);
                material.emissiveIntensity = 1;
            }
        });

        composer = new EffectComposer(renderer);
        const ssaoPass = new SSAOPass(scene, camera, 1, 1);
        ssaoPass.kernelRadius = 16;
        composer.addPass(ssaoPass);

        const params = {
            exposure: 1,
            bloomStrength: 5,
            bloomThreshold: 0,
            bloomRadius: 0,
            scene: 'Scene with Glow'
        };
        const bloomPass = new UnrealBloomPass(new Three.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.threshold = params.bloomThreshold;
        bloomPass.strength = params.bloomStrength;
        bloomPass.radius = params.bloomRadius;
        // composer.addPass(bloomPass)

        const gui = new GUI();
        gui.add(params, 'bloomThreshold', 0.0, 1.0).onChange(value => {
            bloomPass.threshold = Number(value);
        });

        gui.add(params, 'bloomStrength', 0.0, 10.0).onChange(value => {
            bloomPass.strength = Number(value);
        });

        gui.add(params, 'bloomRadius', 0.0, 1.0).step(0.01).onChange(value => {
            bloomPass.radius = Number(value);
        });


        const fxaaPass = new ShaderPass(FXAAShader);
        composer.addPass(fxaaPass);
        const pixelRatio = renderer.getPixelRatio();
        fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);
        fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);

        handleResize();
        window.addEventListener("resize", handleResize);

        frameId = requestAnimationFrame(onRender);
    };

    const end = async () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener("resize", handleResize);
    };

    const onRender = () => {
        frameId = requestAnimationFrame(onRender);
        stats.begin();
        composer.render();
        // renderer.render(scene, camera);
        stats.end();
    };

    const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        composer.setSize(width, height);
    };

    return <canvas className={"w-full h-screen"} ref={canvas}/>;
}
