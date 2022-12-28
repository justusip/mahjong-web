import * as THREE from "three";

import Resources from "./Resources";
import Tile from "../../types/Tile";

export default class TileForge {

    static spawnTile() {
        const tileObj = <THREE.Mesh>Resources.getGLTF("models/tile.glb").scene.children[0].clone();
        tileObj.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshToonMaterial({
                    color: new THREE.Color(0xffffff),
                    map: (child.material as THREE.MeshStandardMaterial).map
                });
            }
        });

        const decalGeometry = new THREE.PlaneGeometry(.02 * 1.4, .03 * 1.4, 1);
        const decalMaterial = new THREE.MeshBasicMaterial({
            map: Resources.getTexture("img/symbols.png"),
            transparent: true,
            depthTest: true,
            depthWrite: false,
            polygonOffset: true,
            polygonOffsetFactor: -4,
        });
        const decalObj = new THREE.Mesh(decalGeometry, decalMaterial);
        tileObj.attach(decalObj);
        decalObj.position.set(0, 0, .01);

        this.setTileVirtual(tileObj, false);
        this.setTile(tileObj, null);

        return tileObj;
    }

    static setTileVirtual(tileObj: THREE.Object3D, virtual: boolean) {
        tileObj.castShadow = true;
        tileObj.layers.set(0);
        tileObj.traverse(obj => obj.userData["virtual"] = true);
        tileObj.children[0].layers.set(0);
        return;
        tileObj.castShadow = !virtual;
        tileObj.layers.set(virtual ? 1 : 0);
        tileObj.children[0].layers.set(0);
        tileObj.traverse(obj => obj.userData["virtual"] = virtual);
        const decal = tileObj.children[0];
        decal.layers.set(virtual ? 1 : 0);
    }

    static setTile(tileObj: THREE.Object3D, tile: Tile) {
        tileObj.userData.tile = tile;

        const decal = <THREE.Mesh>tileObj.children[0];
        const y = 5 - (!tile ? 5 : tile.suit);
        const x = !tile ? 0 : tile.rank;
        const offsetX = 1 / 9;
        const offsetY = 1 / 6;

        const uvPos = [
            [
                new THREE.Vector2(x * offsetX, y * offsetY),
                new THREE.Vector2(x * offsetX, (y + 1) * offsetY)
            ],
            [
                new THREE.Vector2((x + 1) * offsetX, y * offsetY),
                new THREE.Vector2((x + 1) * offsetX, (y + 1) * offsetY),
            ]
        ];

        const geometry = <THREE.BufferGeometry>decal.geometry;

        const uvAttributes = geometry.attributes.uv;
        uvAttributes.setXY(0, uvPos[0][1].x, uvPos[0][1].y);
        uvAttributes.setXY(2, uvPos[0][0].x, uvPos[0][0].y);
        uvAttributes.setXY(1, uvPos[1][1].x, uvPos[1][1].y);
        uvAttributes.setXY(3, uvPos[1][0].x, uvPos[1][0].y);
        uvAttributes.needsUpdate = true;
    }
}
