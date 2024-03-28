import anime from "animejs";
import assert from "assert";
import * as THREE from "three";

import TileForge from "./TileForge";
import Meld, {MeldType} from "@/types/Meld";
import Tile from "@/types/Tile";
import GameSyncEvent from "@/events/GameSyncEvent";
import EventListener from "@/events/EventListener";
import PlayerDrewEvent from "@/events/PlayerDrewEvent";
import PlayerDiscardEvent from "@/events/PlayerDiscardEvent";
import PlayerMergeEvent from "@/events/PlayerMergeEvent";
import GukEndEvent from "@/events/GukEndEvent";

enum TileType {
    WALL = 0,
    DREW = 1,
    MELD = 2,
    FLOWER = 3,
    DISCARD = 4,
}

const map = <T, >(n: number, predicate: (n: number) => T): T[] => [...Array(n)].map((_, i) => predicate(i));
export default class Animator extends EventListener {
    container: THREE.Object3D;
    animSeatingId: number;

    readonly tileWidth = 0.026;
    readonly tileHeight = 0.037;

    readonly wallPos = map(20, i => new THREE.Vector3((-10.5 + i) * this.tileWidth, .018, .3));
    readonly discardPos = map(24, i => {
        const x = i % 6;
        const y = Math.floor(i / 6);
        return new THREE.Vector3((-5 / 2 + x) * this.tileWidth, .01, .098 + y * 0.036);
    });

    readonly defMeldCursor = -12 * this.tileWidth;

    meldTilesCursor: number;
    flowersTileCursor: number;
    discardCursorH: number; // Required to take care of horizontally placed tiles (Richii)
    discardTileCount: number;

    handPos = new THREE.Vector3(.1, .06, .7);

    constructor(table: THREE.Object3D, animatorPid: number) {
        super();

        this.container = new THREE.Object3D();
        table.add(this.container);

        this.animSeatingId = animatorPid;

        // Display markers on positions
        for (const pos of [
            ...this.wallPos,
            ...this.discardPos,
        ]) {
            const map = new THREE.TextureLoader().load("/sprite.png");
            const material = new THREE.SpriteMaterial({map: map, color: "red", depthTest: false});
            const sprite = new THREE.Sprite(material);
            this.container.add(sprite);
            sprite.scale.multiplyScalar(.01);
            sprite.position.copy(pos);
        }
    }

    setClientSeatingId(clientSeatingId: number) {
        this.container.rotation.y = Math.PI * .5 * ((this.animSeatingId - clientSeatingId) % 4);
    }

    override onGameSync(e: GameSyncEvent) {
        while (this.container.children.length > 0)
            this.container.children[0].removeFromParent();

        this.meldTilesCursor = this.defMeldCursor;
        this.flowersTileCursor = this.defMeldCursor;
        this.discardCursorH = this.discardPos[0].x;
        this.discardTileCount = 0;

        const player = e.players[this.animSeatingId];
        for (const [i, tile] of player.wall.entries()) {
            if (!tile)
                continue;
            const tileObj = TileForge.instantiateTile(tile);
            tileObj.userData.type = TileType.WALL;
            this.container.add(tileObj);
        }
        this.sortWall();

        for (const flower of player.flowers)
            this.onFlower(flower, false);
        for (const meld of player.melds)
            this.addMeld(meld, false);
        if (player.drew)
            this.onDrew(player.drew, false);

        for (const discardTile of player.discards) {
            const tileObj = TileForge.instantiateTile(discardTile);
            tileObj.userData.type = TileType.DISCARD;
            this.container.add(tileObj);
            tileObj.position.copy(new THREE.Vector3(this.discardCursorH, .018, this.discardPos[this.discardTileCount].z));
            tileObj.rotation.copy(new THREE.Euler(-Math.PI * .5, 0, 0));

            this.discardTileCount++;
            if (this.discardTileCount % 6 == 0) {
                this.discardCursorH = this.discardPos[0].x;
            } else {
                this.discardCursorH += this.tileWidth;
            }
        }
        // setTimeout(() => {
        //     // this.onDiscard(wall[0], false);
        //     this.onMerge(
        //         new Meld(MeldType.MingPung, this.selfPid, Tile.parseList("b2 b2 b2")),
        //         false
        //     );
        //     // this.onSik();
        // }, 1000);
    }

    override onPlayerDrew(e: PlayerDrewEvent) {
        if (this.animSeatingId === e.pid)
            this.onDrew(e.tile, true);
    }

    onDrew(tile: Tile, animate: boolean) {
        const tileObj = TileForge.instantiateTile(tile);
        tileObj.userData.type = TileType.DREW;
        this.container.add(tileObj);
        tileObj.position.copy(this.wallPos[this.wallPos.length - 1]); //TODO
        if (animate) {
            anime({
                targets: tileObj.position,
                y: [tileObj.position.y + .02, tileObj.position.y],
                duration: 200,
                easing: "easeOutQuad"
            });
            anime({
                targets: tileObj.rotation,
                z: [tileObj.rotation.z + Math.PI / 2, tileObj.rotation.z],
                duration: 200,
                easing: "easeOutQuad"
            });
        }
        setTimeout(() => {
            if (tile.isFlower()) {
                this.onFlower(tile, true);
            }
        }, 1000);
    }

    override onPlayerDiscard(e: PlayerDiscardEvent) {
        if (this.animSeatingId === e.pid)
            this.onDiscard(e.tile, true);
    }

    onDiscard(tile: Tile, animate: boolean) {
        const tileObj = this.container.children.find(o =>
            (o.userData.type === TileType.WALL || o.userData.type === TileType.DREW) &&
            tile.identicalAs(o.userData.tile)
        );
        tileObj.userData.type = TileType.DISCARD;

        const discardIdx = this.container.children.filter(o => o.userData.type === TileType.DISCARD).length - 1;
        tileObj.position.copy(this.discardPos[discardIdx]);
        tileObj.rotation.set(-Math.PI * .5, 0, Math.PI / 180);

        // const clip = this.container.handMixers[pid].clipAction(Resources.cloneGLTF("models/arm.glb").animations[0]);
        // clip.loop = THREE.LoopOnce;
        // clip.clampWhenFinished = true;
        // this.container.handMixers[pid].setTime(0);
        // clip.reset().play();

        if (animate) {
            // anime({
            //     targets: drewTileObj.position,
            //     x: discardPos.x,
            //     z: discardPos.z,
            //     duration: 500,
            //     easing: "easeInOutCubic"
            // });
            // anime({
            //     targets: drewTileObj.position,
            //     y: discardPos.y,
            //     delay: 250,
            //     duration: 250,
            //     easing: "easeInOutCubic"
            // });
            //
            // anime.remove(this.container.handObjs[pid]);
            // this.container.handObjs[pid].position.copy(this.handPos);
            // anime.timeline({targets: this.container.handObjs[pid].position})
            //     .add({x: discardPos.x, z: discardPos.z, duration: 500, easing: "easeInOutCubic"})
            //     .add({x: this.handPos.x, z: this.handPos.z, duration: 500, easing: "easeInOutCubic"});
            // anime.timeline({targets: this.container.handObjs[pid].position})
            //     .add({y: discardPos.y, delay: 250, duration: 250, easing: "easeInOutCubic"})
            //     .add({y: this.handPos.y, duration: 250, easing: "easeInOutCubic"});
        }

        // i.e., Move the drew tile into the wall and sort
        const drewTileObj = this.container.children.find(o => o.userData.type === TileType.DREW);
        if (drewTileObj) {
            drewTileObj.userData.type = TileType.WALL;
            this.sortWall();
        }
    }

    sortWall() {
        const sortedWall = this.container.children
            .filter(o => o.userData.type === TileType.WALL)
            .sort((a, b) => a.userData.tile.compareTo(b.userData.tile));
        for (const [i, tileObj] of sortedWall.entries()) {
            tileObj.position.copy(this.wallPos[this.wallPos.length - 2 - sortedWall.length + i]);
        }
    }

    override onPlayerMerge(e: PlayerMergeEvent) {
        if (this.animSeatingId === e.pid)
            this.addMeld(e.meld, true);
    }

    /**
     * If animate is false, then this function will add a meld to the corner (used for onGameSync)
     * If animate is true, then this function will remove tiles from relevant players and add a meld to relevant players.
     * @param meld
     * @param animate
     */
    addMeld(meld: Meld, animate: boolean) {
        // const clip = this.container.handMixers[pid].clipAction(Resources.cloneGLTF("models/arm.glb").animations[1]);
        // clip.loop = THREE.LoopOnce;
        // clip.clampWhenFinished = true;
        // this.container.handMixers[pid].setTime(0);
        // clip.reset().play();

        // Remove relevant tiles from the wall / tile that has just been discarded
        if (this.animSeatingId === meld.causedBy) {
            for (const tile of meld.tiles) {
                let tileObj: THREE.Object3D | null = null;
                if (meld.causedBy === this.animSeatingId) {
                    tileObj = this.container.children.find(o =>
                        (o.userData.type === TileType.WALL || o.userData.type === TileType.DREW) &&
                        o.userData.tile.identicalAs(tile));
                } else {
                    tileObj = this;
                }
                tileObj?.parent.remove(tileObj);
            }
        }

        const meldPointCauser = false;
        const tilePos: THREE.Vector3[] = [];
        const tileRot: THREE.Euler[] = [];

        let pointTo = -1; // 0: 上家, 1: 對家, 2: 下家, -1: disable showing direction
        if (meldPointCauser)
            pointTo = 3 - ((meld.causedBy - this.animSeatingId + 4) % 4);
        assert(pointTo >= -1 && pointTo <= 2);

        // Generate positions for melds
        for (let i = 0; i < meld.tiles.length; i++) {
            const pos = new THREE.Vector3(this.meldTilesCursor + this.tileWidth / 2, .018, .3);
            const rot = new THREE.Euler(-Math.PI * .5, 0, 0);

            if (pointTo == i) {
                pos.x = this.meldTilesCursor + this.tileHeight / 2;
                pos.z += .004;
                rot.z = Math.PI / 2;
                this.meldTilesCursor += this.tileHeight - this.tileWidth;
            }

            tilePos.push(pos);
            tileRot.push(rot);
            this.meldTilesCursor += this.tileWidth;
        }

        // If AmGong, make the middle 2 tiles of the meld face downwards
        // If MingGong/GaaGong and is Japnese Mahjong, make the meld points to the one who caused the gong
        if (meld.isGong()) {
            if (meld.meldType === MeldType.AmGong) {
                for (let i = 1; i <= 2; i++) {
                    tileRot[i].y = Math.PI;
                }
            } else if (pointTo != -1) {
                tilePos[3].x -= (this.tileWidth / 2) + this.tileWidth * (2 - pointTo) + (this.tileHeight / 2);
                tilePos[3].z -= this.tileWidth;
                tileRot[3].z = Math.PI / 2;
                this.meldTilesCursor -= this.tileWidth;
            }
        }

        // Instantiate tiles on the positions
        for (const [i, tile] of meld.tiles.entries()) {
            const tileObj = TileForge.instantiateTile(tile);
            tileObj.userData.type = TileType.MELD;
            this.container.add(tileObj);
            tileObj.position.copy(tilePos[i]);
            tileObj.rotation.copy(tileRot[i]);
        }
        this.sortWall();

        // anime.remove(this.container.handObjs[pid].position);
        // this.container.handObjs[pid].position.copy(mergePos.clone().add(new THREE.Vector3(0.05, 0, 0)));
        // anime.timeline({targets: this.container.handObjs[pid].position})
        //     .add({x: mergePos.x, z: mergePos.z, duration: 100, easing: "linear"})
        //     .add({x: this.handPos.x, z: this.handPos.z, duration: 500, easing: "easeInOutCubic"});
        // anime({
        //     targets: this.container.handObjs[pid].position,
        //     y: this.handPos.y,
        //     delay: 100,
        //     duration: 500,
        //     easing: "easeInOutCubic"
        // });
    }

    onFlower(flower: Tile, animate: boolean) {
        const tileObj = TileForge.instantiateTile(flower);
        tileObj.userData.type = TileType.FLOWER;
        this.container.add(tileObj);
        tileObj.position.copy(new THREE.Vector3(this.flowersTileCursor + this.tileWidth / 2, .018, .26));
        tileObj.rotation.copy(new THREE.Euler(-Math.PI * .5, 0, 0));
        this.flowersTileCursor += this.tileWidth;
    }

    override onGukEnd(e: GukEndEvent) {
        for (const sik of e.siks) {
            if (sik.pid === this.animSeatingId) {
                this.onSik();
                return;
            }
        }
    }

    onSik() {
        const tileObjs = this.container.children.filter(o =>
            o.userData.type === TileType.WALL ||
            o.userData.type === TileType.DREW
        );
        for (const [i, tileObj] of tileObjs.entries()) {
            anime({targets: tileObj.rotation, x: -Math.PI * .5, delay: i * 30, duration: 100, easing: "easeInCubic"});
            anime({
                targets: tileObj.position,
                y: .024,
                z: tileObjs[0].position.z - 0.01,
                delay: i * 30,
                duration: 100,
                easing: "easeInCubic"
            });
        }
    }
}
