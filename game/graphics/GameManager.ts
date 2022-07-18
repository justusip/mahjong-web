import * as THREE from "three";
import Resources from "./Resources";
import Tile from "../mechanics/Tile";
import TileForge from "./TileForge";
import Animator from "./Animator";
import Meld, {MeldType} from "../mechanics/Meld";
import {ms} from "../../utils/Delay";

const map = <T, >(n: number, predicate: (n: number) => T): T[] => [...Array(n)].map((_, i) => predicate(i));
export default class GameManager {
    scene: THREE.Scene;

    selfPid: number;

    animator: Animator;
    tableObj: THREE.Object3D;

    handObjs: THREE.Object3D[];
    handMixers: THREE.AnimationMixer[];

    lastDiscard: THREE.Object3D;
    lastDiscardPid: number = null;

    hotbarCtners: THREE.Group[];
    drewCtners: THREE.Group[];
    discardCtners: THREE.Group[];
    cornerCtners: THREE.Group[];

    ownPos = map(13, i => new THREE.Vector3((-13 / 2 - .25 + i) * 0.026, .03, .3));
    drewPos = new THREE.Vector3((13 / 2 + .25) * 0.026, .03, .3);
    discardPos = map(24, i => {
        const x = i % 6;
        const y = Math.floor(i / 6);
        return new THREE.Vector3((-5 / 2 + x) * 0.026, .024, .098 + y * 0.036);
    });
    cornerPos = map(24, i => new THREE.Vector3(-.205 + i * 0.026, .024, .245));
    namePos = [
        new THREE.Vector3(-.14, .024, .2),
        new THREE.Vector3(.2, .024, .14),
        new THREE.Vector3(.14, .024, -.2),
        new THREE.Vector3(-.2, .024, -.14),
    ];

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.animator = new Animator(this);
    }

    onInit() {
        this.tableObj = Resources.getGLTF("models/table.glb").scene.children.find(o => o.name === "Table").clone();
        this.scene.add(this.tableObj);
        this.tableObj.receiveShadow = true;
        this.tableObj.name = "table";

        this.handObjs = [];
        this.handMixers = [];
        for (let i = 0; i < 4; i++) {
            const handContainer = new THREE.Group();
            this.scene.add(handContainer);
            handContainer.rotation.set(0, Math.PI / 2 * i, 0);

            const hand = Resources.cloneGLTF("models/arm.glb").scene as THREE.Object3D;
            handContainer.add(hand);
            hand.position.set(.1, .06, .7);
            this.handObjs.push(hand);

            this.handMixers.push(new THREE.AnimationMixer(hand));
        }
    }

    onRoomStart(selfPid: number) {
        this.selfPid = selfPid;
        this.scene.getObjectByName("cameraPivot").rotation.y = selfPid * Math.PI * .5;
        // cam.rotateOnWorldAxis(-selfPid * 90 / 180 * Math.PI);
    }

    onGukStart(players: { hotbar: (Tile | null)[], melds: Meld[], flowers: Tile[] }[], fung: number, guk: number) {
        this.animator.onReset();
        this.tableObj.remove(...this.tableObj.children.filter(o => o.type === "Group"));
        const addContainer = (pid: number): THREE.Group => {
            const container = new THREE.Group();
            this.tableObj.add(container);
            container.rotation.set(0, Math.PI / 2 * pid, 0);
            return container;
        };
        this.hotbarCtners = [...Array(4)].map((_, i) => addContainer(i));
        this.drewCtners = [...Array(4)].map((_, i) => addContainer(i));
        this.discardCtners = [...Array(4)].map((_, i) => addContainer(i));
        this.cornerCtners = [...Array(4)].map((_, i) => addContainer(i));

        players.forEach((p, pid) => {
            for (let i = 0; i < p.hotbar.length; i++) {
                let tileObj = TileForge.spawnTile();
                this.hotbarCtners[pid].add(tileObj);
                tileObj.position.copy(this.ownPos[i]);
                if (this.selfPid === pid) {
                    TileForge.setTileVirtual(tileObj, true);
                    TileForge.setTile(tileObj, p.hotbar[i]);
                }
            }

            const cornerTiles = [...p.flowers, ...p.melds.flatMap(m => m.tiles)];
            cornerTiles.forEach(t => {
                let tileObj = TileForge.spawnTile();
                this.cornerCtners[pid].add(tileObj);
                TileForge.setTile(tileObj, t);
                TileForge.setTileVirtual(tileObj, false);
                this.animator.teleportToCorner(pid, tileObj);
            });
        });
    }

    async onSomeoneDrew(pid: number, tile: Tile) {
        let tileObj = TileForge.spawnTile();
        this.drewCtners[pid].add(tileObj);

        TileForge.setTile(tileObj, tile);
        TileForge.setTileVirtual(tileObj, this.selfPid === pid);
        this.animator.animteDrew(tileObj);

        if (tile && tile.isFlower()) {
            await ms(1000);
            tileObj.parent.remove(tileObj);
            this.cornerCtners[pid].add(tileObj);
            TileForge.setTileVirtual(tileObj, false);
            this.animator.animateMerge(pid, [tileObj]);
        }
    }

    async onSomeoneDiscard(pid: number, tile: Tile) {
        let tileObj = null;
        const tray = [
            this.drewCtners[pid].children.length > 0 ? this.drewCtners[pid].children[0] : null,
            ...this.hotbarCtners[pid].children
        ];
        if (this.selfPid === pid) {
            tileObj = tray.find(tileObj => tile.equalsTo(tileObj.userData.tid));
            TileForge.setTileVirtual(tileObj, false);
        } else {
            tileObj = tray.filter(o => o !== null)[Math.floor(Math.random() * tray.filter(o => o !== null).length)];
            TileForge.setTile(tileObj, tile);
        }
        this.lastDiscard = tileObj;
        this.lastDiscardPid = pid;
        this.animator.animateDiscard(pid, tileObj);
        await ms(1000);
        this.sort(pid);
    }

    async onSomeoneMerge(pid: number, meld: Meld) {
        const tileObjs: THREE.Object3D[] = [meld.isSeize() ? this.lastDiscard : this.drewCtners[pid].children[0]];

        const andTiles = [...meld.tiles];
        const causeTile = andTiles.splice(andTiles.findIndex(t => t.equalsTo(tileObjs[0].userData.tile)), 1)[0];

        if (meld.meldType !== MeldType.GaaGong) {
            if (this.selfPid === pid) {
                const owned = [...this.hotbarCtners[pid].children];
                for (let tile of andTiles) {
                    const tileObj = owned.splice(owned.findIndex(tileObj => tile.equalsTo(tileObj.userData.tile)), 1)[0];
                    TileForge.setTileVirtual(tileObj, false);
                    tileObjs.push(tileObj);
                }
            } else {
                for (let tile of andTiles) {
                    const tileObj = this.hotbarCtners[pid].children.pop();
                    TileForge.setTile(tileObj, tile);
                    tileObjs.push(tileObj);
                }
            }
        }
        if (meld.isSeize()) {
            this.animator.freeDiscardPos(this.lastDiscardPid);
        } else {
            if (this.selfPid !== pid)
                TileForge.setTile(tileObjs[0], causeTile);
        }
        tileObjs.sort((a, b) => a.userData.tile.compareTo(b.userData.tile));

        tileObjs.forEach((tileObj, i) => {
            TileForge.setTileVirtual(tileObj, false);
            if (meld.meldType === MeldType.AmGong && (i === 1 || i === 2)) {
                tileObj.rotation.y = Math.PI;
            }
            tileObj.parent.remove(tileObj);
            this.cornerCtners[pid].add(tileObj);
        });

        this.animator.animateMerge(pid, tileObjs);
        this.sort(pid);
    }

    onSomeoneSik(pid: number, tiles: Tile[], extraTile: Tile) {
        const tileEyeObj = this.drewCtners[pid].children.length > 0 ? this.drewCtners[pid].children[0] : null;
        if (this.selfPid === pid) {
            this.hotbarCtners[pid].children.forEach(tileObj => TileForge.setTileVirtual(tileObj, false));
            if (tileEyeObj !== null)
                TileForge.setTileVirtual(tileEyeObj, false);
        } else {
            this.hotbarCtners[pid].children.forEach((tileObj, i) => TileForge.setTile(tileObj, tiles[i]));
            if (tileEyeObj !== null)
                TileForge.setTile(tileEyeObj, extraTile);
        }
        this.animator.animateEat(this.hotbarCtners[pid].children, tileEyeObj);
    }

    sort(pid: number) {
        const owned = this.hotbarCtners[pid].children; //reference?
        const drewTileObj = this.drewCtners[pid].children.length > 0 ? this.drewCtners[pid].children[0] : null;
        if (drewTileObj !== null) {
            drewTileObj.parent.remove(drewTileObj);
            this.hotbarCtners[pid].add(drewTileObj);
        }
        if (this.selfPid === pid) {
            owned.sort((a, b) => a.userData.tile.compareTo(b.userData.tile));
        } else {
            //select random location and insert the new tile in
            if (drewTileObj !== null) {
                owned.splice(owned.indexOf(drewTileObj), 1);
                owned.splice(Math.floor(Math.random() * owned.length), 0, drewTileObj);
            }
        }
        const newPos = owned.map(() => null);
        for (let j = 0; j < owned.length; j++) {
            newPos[j] = this.ownPos[this.ownPos.length - owned.length + j];
        }
        this.animator.animateSort(owned, newPos, drewTileObj);
    }
}
