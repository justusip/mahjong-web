import * as THREE from "three";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

class Resources {
    static gltfLoader: GLTFLoader = new GLTFLoader();
    static fbxLoader: FBXLoader = new FBXLoader();
    static textureLoader: THREE.TextureLoader = new THREE.TextureLoader();
    static urls: string[] = [
        "models/table.glb",
        "models/tile.glb",
        "models/arm.glb",
        "img/symbols.png",
        // "models/interior.glb",
        // "models/panda.glb",
    ];
    static library: { [url: string]: any } = {};

    static async load() {
        const draco = new DRACOLoader();
        draco.setDecoderConfig({type: 'js'});
        draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
        this.gltfLoader.setDRACOLoader(draco);
        this.library = {};
        for (const url of this.urls) {
            this.library[url] = await new Promise<any>(r => {
                if (url.endsWith(".png"))
                    this.textureLoader.load(url, o => r(o));
                else if (url.endsWith(".fbx"))
                    this.fbxLoader.load(url, o => r(o));
                else if (url.endsWith(".glb"))
                    this.gltfLoader.load(url, o => r(o));
            });
        }
    }

    static getGLTF(url: string): GLTF {
        return this.library[url];
    }

    static getFBX(url: string): THREE.Object3D {
        return this.library[url];
    }

    static getTexture(url: string): THREE.Texture {
        return this.library[url];
    }

    static cloneGLTF(url: string): any {
        const gltf = this.getGLTF(url);
        const clone = {
            animations: gltf.animations,
            scene: gltf.scene.clone(true)
        };

        const skinnedMeshes: any = {};

        gltf.scene.traverse(node => {
            if (node instanceof THREE.SkinnedMesh) {
                skinnedMeshes[node.name] = node;
            }
        });

        const cloneBones: any = {};
        const cloneSkinnedMeshes: any = {};

        clone.scene.traverse(node => {
            if (node instanceof THREE.Bone) {
                cloneBones[node.name] = node;
            }

            if (node instanceof THREE.SkinnedMesh) {
                cloneSkinnedMeshes[node.name] = node;
            }
        });

        for (const name in skinnedMeshes) {
            const skinnedMesh = skinnedMeshes[name];
            const skeleton = skinnedMesh.skeleton;
            const cloneSkinnedMesh = cloneSkinnedMeshes[name];

            const orderedCloneBones = [];

            for (let i = 0; i < skeleton.bones.length; ++i) {
                const cloneBone = cloneBones[skeleton.bones[i].name];
                orderedCloneBones.push(cloneBone);
            }

            cloneSkinnedMesh.bind(
                new THREE.Skeleton(orderedCloneBones, skeleton.boneInverses),
                cloneSkinnedMesh.matrixWorld);
        }

        return clone;
    }
}

export default Resources;
