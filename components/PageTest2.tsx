// import React, {useEffect, useRef} from "react";
// import {Engine} from "@babylonjs/core/Engines/engine";
// import {Scene} from "@babylonjs/core/scene";
// import {Color3, Vector3} from "@babylonjs/core/Maths/math";
// import {FreeCamera} from "@babylonjs/core/Cameras/freeCamera";
// import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight";
// import {Mesh} from "@babylonjs/core/Meshes/mesh";
// import "@babylonjs/loaders/glTF";
//
// import {GridMaterial} from "@babylonjs/materials/grid";
//
// import "@babylonjs/core/Meshes/meshBuilder";
// import {ArcRotateCamera, CubeTexture, SceneLoader} from "@babylonjs/core";
// import * as BABYLON from "@babylonjs/core/Legacy/legacy";
//
// export default function PageTest2(): React.ReactElement {
//
//     const canvas = useRef<HTMLCanvasElement>();
//
//     useEffect(() => {
//         init().then();
//         return () => {
//             end().then();
//         };
//     }, []);
//
//     const init = async () => {
//         const engine = new Engine(canvas.current);
//
//         const scene = new Scene(engine);
//         // scene.debugLayer.show();
//
//         var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
//
//         // const camera = new BABYLON.Camera("camera", BABYLON.Tools.ToRadians(90), BABYLON.Tools.ToRadians(65), 40, BABYLON.Vector3.Zero(), scene);
//
//         var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(1, 1, 5), scene);
//         camera.rotation.y = 44;
//         camera.attachControl(canvas, true);
//
//         const interior = await SceneLoader.ImportMeshAsync(undefined, "/models/", "interior.glb");
//
//         const panda = await SceneLoader.ImportMeshAsync(undefined, "/models/", "panda.glb");
//
//         engine.runRenderLoop(() => {
//             scene.render();
//         });
//     };
//
//     const end = async () => {
//
//     };
//
//     return <canvas className={"w-full h-screen bg-black"} ref={canvas}/>;
// }
