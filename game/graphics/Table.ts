import * as Three from "three";
import anime from "animejs";
import Resources from "./Resources";
import Room from "./Room";
import Tile from "../mechanics/Tile";
import TileForge from "./TileForge";
import Animator from "./Animator";
import Meld, {MeldType} from "../mechanics/Meld";

export default class Table {
    room: Room;
    scene: Three.Scene;

    selfPid: number;

    animator: Animator;
    tableObj: Three.Object3D;
    hands: Three.Object3D[];

    lastDiscard: Three.Object3D;
    lastDiscardPid: number = null;

    ownedContainers: Three.Group[];
    drewContainers: Three.Group[];
    discardContainers: Three.Group[];
    cornerContainers: Three.Group[];

    ownPos: Three.Vector3[];
    drewPos: Three.Vector3;
    discardPos: Three.Vector3[];
    cornerPos: Three.Vector3[];

    displayDiscs: Three.Object3D[][];
    namePos: Three.Vector3[];

    constructor(room: Room) {
        this.room = room;
        this.scene = room.scene;
        this.animator = new Animator(room, this);

        this.ownPos = [...Array(13)].map((_, i) => {
            return new Three.Vector3((-13 / 2 - .25 + i) * 0.026, .03, .3);
        });
        this.drewPos = new Three.Vector3((13 / 2 + .25) * 0.026, .03, .3);
        this.discardPos = [...Array(24)].map((_, i) => {
            const x = i % 6;
            const y = Math.floor(i / 6);
            return new Three.Vector3((-5 / 2 + x) * 0.026, .024, .098 + y * 0.036);
        });
        this.cornerPos = [...Array(24)].map((_, i) => {
            return new Three.Vector3(-.205 + i * 0.026, .024, .245);
        });
        this.namePos = [
            new Three.Vector3(-.14, .024, .2),
            new Three.Vector3(.2, .024, .14),
            new Three.Vector3(.14, .024, -.2),
            new Three.Vector3(-.2, .024, -.14),
        ];
    }

    construct(selfPid: number) {
        this.tableObj = Resources.getGLTF("models/table.glb").scene.children.find(o => o.name === "Table").clone();
        this.scene.add(this.tableObj);
        this.tableObj.receiveShadow = true;
        this.tableObj.name = "table";
        this.tableObj.position.set(0, 0, 0);

        this.displayDiscs = [...Array(4)].map((_, i) =>
            [...Array(8)].map((_, j) =>
                this.tableObj
                    .children
                    .filter(o => o.name.startsWith("Display"))[i]
                    .children[j])
        );
        this.selfPid = selfPid;
        this.tableObj.rotation.set(0, -selfPid * 90 / 180 * Math.PI, 0);
    }

    setZong(zongLoc: number) {
        for (let pid = 0; pid < 4; pid++) {
            anime({
                targets: this.displayDiscs[pid][7].rotation,
                x: (((pid - zongLoc) % 4 + 4) % 4 + 1) * (-72 / 180 * Math.PI),
                duration: 3000,
                easing: "easeOutCubic"
            });
        }
    }

    setScore(scores: number[]) {
        for (let pid = 0; pid < 4; pid++) {
            for (let digitPos = 0; digitPos < 7; digitPos++) {
                const score = Math.max(-999999, Math.min(999999, scores[pid]));
                const deg = digitPos === 6 ?
                    (score >= 0 ? 0 : 180) :
                    Math.floor((Math.abs(score) / Math.pow(10, digitPos)) % 10) * -36;
                anime({
                    targets: this.displayDiscs[pid][digitPos].rotation,
                    x: deg / 180 * Math.PI,
                    duration: 3000,
                    easing: "easeOutCubic"
                });
            }
        }
    }

    addContainer(pid: number): Three.Group {
        const container = new Three.Group();
        this.tableObj.add(container);
        container.rotation.set(0, Math.PI / 2 * pid, 0);
        return container;
    }

    reset(ownedTiles: Tile[], cornersFlatten: Tile[][]) {
        this.animator.onReset();
        this.tableObj.remove(...this.tableObj.children.filter(o => o.type === "Group"));

        this.ownedContainers = [...Array(4)].map((_, i) => this.addContainer(i));
        this.drewContainers = [...Array(4)].map((_, i) => this.addContainer(i));
        this.discardContainers = [...Array(4)].map((_, i) => this.addContainer(i));
        this.cornerContainers = [...Array(4)].map((_, i) => this.addContainer(i));

        this.ownedContainers.forEach((container, pid) => {
            for (let i = 0; i < ownedTiles.length; i++) {
                let tileObj = TileForge.spawnTile();
                container.add(tileObj);
                tileObj.position.copy(this.ownPos[i]);
                if (this.selfPid === pid) {
                    TileForge.setTileVirtual(tileObj, true);
                    TileForge.setTile(tileObj, ownedTiles[i]);
                }
            }
        });
        cornersFlatten.forEach((corner, pid) =>
            corner.forEach(t => {
                let tileObj = TileForge.spawnTile();
                this.cornerContainers[pid].add(tileObj);

                TileForge.setTile(tileObj, t);
                TileForge.setTileVirtual(tileObj, false);
                this.animator.teleportToCorner(pid, tileObj);
            })
        );
    }

    onTileDrew(pid: number, tile: Tile) {
        let tileObj = TileForge.spawnTile();
        this.drewContainers[pid].add(tileObj);

        TileForge.setTile(tileObj, tile);
        TileForge.setTileVirtual(tileObj, this.selfPid === pid);
        this.animator.animteDrew(tileObj);

        if (tile !== null && tile.type === 4) {
            setTimeout(() => {
                tileObj.parent.remove(tileObj);
                this.cornerContainers[pid].add(tileObj);
                TileForge.setTileVirtual(tileObj, false);
                this.animator.animateMerge(pid, [tileObj]);
            }, 1000);
        }
    }

    onSomeoneDiscard(pid: number, tid: Tile, idx: number) {
        let tileObj = null;
        const tray = [
            this.drewContainers[pid].children.length > 0 ? this.drewContainers[pid].children[0] : null,
            ...this.ownedContainers[pid].children
        ];
        if (this.selfPid === pid) {
            //tileObj = tray.find(tileObj => tid.equals(tileObj.userData.tid));
            tileObj = tray[idx + 1];
            TileForge.setTileVirtual(tileObj, false);
        } else {
            tileObj = tray.filter(o => o !== null)[Math.floor(Math.random() * tray.filter(o => o !== null).length)];
            TileForge.setTile(tileObj, tid);
        }
        this.lastDiscard = tileObj;
        this.lastDiscardPid = pid;
        this.animator.animateDiscard(pid, tileObj);
        this.sort(pid);
        // setTimeout(() => {
        //     this.sort(pid);
        // }, 1000);
    }

    onSomeoneMerge(pid: number, meld: Meld) {
        const tileObjs: Three.Object3D[] = [meld.isSeize() ? this.lastDiscard : this.drewContainers[pid].children[0]];

        const andTiles = [...meld.tiles];
        const causeTile = andTiles.splice(andTiles.findIndex(t => t.equals(tileObjs[0].userData.tile)), 1)[0];

        if (meld.type !== MeldType.GaaGong) {
            if (this.selfPid === pid) {
                const owned = [...this.ownedContainers[pid].children];
                for (let tile of andTiles) {
                    const tileObj = owned.splice(owned.findIndex(tileObj => tile.equals(tileObj.userData.tile)), 1)[0];
                    TileForge.setTileVirtual(tileObj, false);
                    tileObjs.push(tileObj);
                }
            } else {
                for (let tile of andTiles) {
                    const tileObj = this.ownedContainers[pid].children.pop();
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
        tileObjs.sort((a, b) => a.userData.tile.compare(b.userData.tile));

        tileObjs.forEach((tileObj, i) => {
            TileForge.setTileVirtual(tileObj, false);
            if (meld.type === MeldType.AmGong && (i === 1 || i === 2)) {
                tileObj.rotation.y = Math.PI;
            }
            tileObj.parent.remove(tileObj);
            this.cornerContainers[pid].add(tileObj);
        });

        this.animator.animateMerge(pid, tileObjs);
        this.sort(pid);
    }

    sort(pid: number) {
        const owned = this.ownedContainers[pid].children; //reference?
        const drewTileObj = this.drewContainers[pid].children.length > 0 ? this.drewContainers[pid].children[0] : null;
        if (drewTileObj !== null) {
            drewTileObj.parent.remove(drewTileObj);
            this.ownedContainers[pid].add(drewTileObj);
        }
        if (this.selfPid === pid) {
            owned.sort((a, b) => a.userData.tile.compare(b.userData.tile));
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

    onSomeoneEat(pid: number, tiles: Tile[], tileEye: Tile) {
        const tileEyeObj = this.drewContainers[pid].children.length > 0 ? this.drewContainers[pid].children[0] : null;
        if (this.selfPid === pid) {
            this.ownedContainers[pid].children.forEach(tileObj => TileForge.setTileVirtual(tileObj, false));
            if (tileEyeObj !== null)
                TileForge.setTileVirtual(tileEyeObj, false);
        } else {
            this.ownedContainers[pid].children.forEach((tileObj, i) => TileForge.setTile(tileObj, tiles[i]));
            if (tileEyeObj !== null)
                TileForge.setTile(tileEyeObj, tileEye);
        }
        this.animator.animateEat(this.ownedContainers[pid].children, tileEyeObj);
    }
}
