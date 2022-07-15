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

        this.setTile(tileObj, null);
        return tileObj;
    }

    static setTile(tileObj: Three.Object3D, tile: Tile) {
        tileObj.userData.tile = tile;

        const decal = <Three.Mesh>tileObj.children[0];
        let x = !tile ? 4 : tile.num;
        let y = 4 - (!tile ? 8 : tile.type);
        let offsetX = 1 / 9;
        let offsetY = 1 / 5;

        let uvPos = [
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

        const uvAttributes = geometry.attributes.uv;
        uvAttributes.setXY(0, uvPos[0][1].x, uvPos[0][1].y);
        uvAttributes.setXY(2, uvPos[0][0].x, uvPos[0][0].y);
        uvAttributes.setXY(1, uvPos[1][1].x, uvPos[1][1].y);
        uvAttributes.setXY(3, uvPos[1][0].x, uvPos[1][0].y);
        uvAttributes.needsUpdate = true;
    }
}
