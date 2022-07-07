
import * as Three from "three";
import Tile from "../mechanics/Tile";
import Resources from "./Resources";

export default class TileForge {

    static spawnTile() {
        const tileObj = <Three.Mesh>Resources.getGLTF("models/tile.glb").scene.children[0].clone();

        let decalGeometry = new Three.PlaneGeometry(.02 * 1.05, .03 * 1.05, 1);
        let decalMaterial = new Three.MeshStandardMaterial({
            map: Resources.getTexture("img/symbols.png"),
            transparent: true,
            depthTest: true,
            depthWrite: false,
            polygonOffset: true,
            polygonOffsetFactor: -4,
        });
        decalMaterial.roughness = 1;
        let decalObj = new Three.Mesh(decalGeometry, decalMaterial);
        tileObj.attach(decalObj);
        decalObj.position.set(0, 0, .01);

        this.setTileVirtual(tileObj, false);
        this.setTile(tileObj, null);
        return tileObj;
    }

    static setTileVirtual(tileObj: Three.Object3D, virtual: boolean) {
        tileObj.castShadow = !virtual;
        tileObj.layers.set(virtual ? 1 : 0);
        //TEMP
        tileObj.traverse(obj => obj.userData["virtual"] = virtual);

        let decal = tileObj.children[0];
        decal.layers.set(virtual ? 1 : 0);
    }

    static setTile(tileObj: Three.Object3D, tile: Tile) {
        tileObj.userData.tile = tile;

        const decal = <Three.Mesh>tileObj.children[0];
        let x = tile === null ? 4 : tile.num;
        let y = 4 - (tile === null ? 8 : tile.type);
        let offsetX = 1 / 9;
        let offsetY = 1 / 5;

        let pos = [
            [
                new Three.Vector2(x * offsetX, y * offsetY),
                new Three.Vector2(x * offsetX, (y + 1) * offsetY)
            ],
            [
                new Three.Vector2((x + 1) * offsetX, y * offsetY),
                new Three.Vector2((x + 1) * offsetX, (y + 1) * offsetY),
            ]
        ];

        const geometry = <Three.BufferGeometry>decal.geometry;

        // geometry.faceVertexUvs[0][0][0].set(pos[0][1].x, pos[0][1].y);
        // geometry.faceVertexUvs[0][0][1].set(pos[0][0].x, pos[0][0].y);
        // geometry.faceVertexUvs[0][0][2].set(pos[1][1].x, pos[1][1].y);
        //
        // geometry.faceVertexUvs[0][1][0].set(pos[0][0].x, pos[0][0].y);
        // geometry.faceVertexUvs[0][1][1].set(pos[1][0].x, pos[1][0].y);
        // geometry.faceVertexUvs[0][1][2].set(pos[1][1].x, pos[1][1].y);
        //
        // geometry.uvsNeedUpdate = true;

        const uvAttributes = geometry.attributes.uv;
        uvAttributes.setXY(0, pos[0][1].x, pos[0][1].y);
        uvAttributes.setXY(2, pos[0][0].x, pos[0][0].y);
        uvAttributes.setXY(1, pos[1][1].x, pos[1][1].y);
        uvAttributes.setXY(3, pos[1][0].x, pos[1][0].y);
        uvAttributes.needsUpdate = true;
    }
}
