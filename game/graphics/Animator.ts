
import * as Three from "three";
import TileForge from "./TileForge";
import Resources from "./Resources";
import anime from "animejs";
import Room from "./Room";
import Table from "./Table";

export default class Animator {

    room: Room;
    table: Table;
    discardOccupied: boolean[][];
    cornerOccupied: boolean[][];
    lastAnimId: number[][];
    handPos = new Three.Vector3(.1, .06, .7);

    constructor(room: Room, table: Table) {
        this.room = room;
        this.table = table;
    }

    onReset() {
        this.lastAnimId = [[], [], [], []];
        this.discardOccupied = [...Array(4)].map(() => Array(this.table.discardPos.length).fill(false));
        this.cornerOccupied = [...Array(4)].map(() => Array(this.table.cornerPos.length).fill(false));
    }

    freeDiscardPos(pid: number) {
        let posIdx = this.discardOccupied[pid].findIndex(o => !o);
        if (posIdx > 0)
            this.discardOccupied[pid][posIdx - 1] = false;
    }

    animteDrew(drewObj: Three.Object3D) {
        drewObj.position.copy(this.table.drewPos);
        anime({
            targets: drewObj.position,
            y: [drewObj.position.y + .02, drewObj.position.y],
            duration: 200,
            easing: "easeOutQuad"
        });
        anime({
            targets: drewObj.rotation,
            z: [drewObj.rotation.z + Math.PI / 2, drewObj.rotation.z],
            duration: 200,
            easing: "easeOutQuad"
        });
    }

    animateDiscard(pid: number, tileObj: Three.Object3D) {
        tileObj.parent.remove(tileObj);
        this.table.discardContainers[pid].add(tileObj);
        TileForge.setTileVirtual(tileObj, false);

        let posIdx = this.discardOccupied[pid].findIndex(o => !o);
        this.discardOccupied[pid][posIdx] = true;
        const discardPos = this.table.discardPos[posIdx];

        tileObj.rotation.set(-Math.PI * .5, 0, (Math.random() - .5) * 4 * Math.PI / 180);

        const clip = this.room.mixers[pid].clipAction(Resources.cloneGLTF("models/arm.glb").animations[0]);
        clip.loop = Three.LoopOnce;
        clip.clampWhenFinished = true;
        this.room.mixers[pid].setTime(0);
        clip.reset().play();

        tileObj.position.copy(this.handPos);
        anime({targets: tileObj.position, x: discardPos.x, z: discardPos.z, duration: 500, easing: "easeInOutCubic"});
        anime({targets: tileObj.position, y: discardPos.y, delay: 250, duration: 250, easing: "easeInOutCubic"});

        anime.remove(this.room.hands[pid]);
        this.room.hands[pid].position.copy(this.handPos);
        anime.timeline({targets: this.room.hands[pid].position})
            .add({x: discardPos.x, z: discardPos.z, duration: 500, easing: "easeInOutCubic"})
            .add({x: this.handPos.x, z: this.handPos.z, duration: 500, easing: "easeInOutCubic"});
        anime.timeline({targets: this.room.hands[pid].position})
            .add({y: discardPos.y, delay: 250, duration: 250, easing: "easeInOutCubic"})
            .add({y: this.handPos.y, duration: 250, easing: "easeInOutCubic"});
    }

    animateMerge(pid: number, tileObjs: Three.Object3D[]) {
        const clip = this.room.mixers[pid].clipAction(Resources.cloneGLTF("models/arm.glb").animations[1]);
        clip.loop = Three.LoopOnce;
        clip.clampWhenFinished = true;
        this.room.mixers[pid].setTime(0);
        clip.reset().play();

        let mergePos = new Three.Vector3(0, 0, 0);
        tileObjs.forEach((tileObj, i) => {
            let posIdx = this.cornerOccupied[pid].findIndex(o => !o);
            this.cornerOccupied[pid][posIdx] = true;

            const pos = this.table.cornerPos[posIdx];
            tileObj.position.copy(pos.clone().add(new Three.Vector3(0.05, 0, 0)));
            anime({targets: tileObj.position, x: pos.x, z: pos.z, duration: 100, easing: "linear"});

            if (Math.floor(tileObjs.length / 2) === i)
                mergePos = this.table.cornerPos[posIdx];

            tileObj.rotation.set(-Math.PI * .5, tileObj.rotation.y, 0);
        });

        anime.remove(this.room.hands[pid].position);
        this.room.hands[pid].position.copy(mergePos.clone().add(new Three.Vector3(0.05, 0, 0)));
        anime.timeline({targets: this.room.hands[pid].position})
            .add({x: mergePos.x, z: mergePos.z, duration: 100, easing: "linear"})
            .add({x: this.handPos.x, z: this.handPos.z, duration: 500, easing: "easeInOutCubic"});
        anime({
            targets: this.room.hands[pid].position,
            y: this.handPos.y,
            delay: 100,
            duration: 500,
            easing: "easeInOutCubic"
        });
    }

    teleportToCorner(pid: number, tileObj: Three.Object3D) {
        let posIdx = this.cornerOccupied[pid].findIndex(o => !o);
        this.cornerOccupied[pid][posIdx] = true;
        tileObj.position.copy(this.table.cornerPos[posIdx]);
        tileObj.rotation.set(-Math.PI * .5, 0, 0);
    }

    animateSort(tileObjs: Three.Object3D[], newPos: Three.Vector3[], drewTileObj: Three.Object3D) {
        for (let j = 0; j < tileObjs.length; j++) {
            if (tileObjs[j] === drewTileObj)
                continue;
            tileObjs[j].position.setX(newPos[j].x);
            // anime({targets: tileObjs[j].position, x: newPos[j].x, duration: 200, easing: "easeInQuad"});
        }
        if (drewTileObj !== null) {
            drewTileObj.position.setX(newPos[tileObjs.indexOf(drewTileObj)].x);
            // anime.timeline({targets: drewTileObj.position})
            //     .add({y: this.table.ownPos[0].y + 0.04, duration: 200, easing: "easeInOutQuad"})
            //     .add({x: newPos[tileObjs.indexOf(drewTileObj)].x, duration: 800, easing: "easeInOutCubic"})
            //     .add({y: this.table.ownPos[0].y, duration: 200, easing: "easeInOutQuad"});
            //
            // anime.timeline({targets: drewTileObj.rotation})
            //     .add({z: -Math.PI * 0.2, duration: 500, easing: "easeInOutBack"})
            //     .add({z: 0, duration: 500, easing: "easeInOutBack"});
        }
    }

    animateEat(ownedTileObjs: Three.Object3D[], lastTileObj: Three.Object3D) {
        ownedTileObjs.forEach((tileObj, i) => {
            anime({targets: tileObj.rotation, x: -Math.PI * .5, delay: i * 30, duration: 100, easing: "easeInCubic"});
            anime({
                targets: tileObj.position,
                y: .024,
                z: this.table.ownPos[0].z - 0.01,
                delay: i * 30,
                duration: 100,
                easing: "easeInCubic"
            });
        });
        if (lastTileObj !== null) {
            lastTileObj.visible = false;
            setTimeout(() => {
                lastTileObj.position.set(14 * 0.026 - (13 / 2 - .5) * 0.026, .024, .32);
                lastTileObj.rotation.set(-Math.PI * .5, 0, -Math.random() * .2);
                lastTileObj.visible = true;

                anime({targets: lastTileObj.position, z: [.32, .28], duration: 200, easing: "easeOutCubic"});
            }, 400);
        }
    }

}
