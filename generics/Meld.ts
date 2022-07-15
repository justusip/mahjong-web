"use strict";

import Tile from "./Tile";

export enum MeldType {
    Soeng,
    Pung,
    MingGong,
    GaaGong,
    AmGong,
    Unclassified // For Invalid melds
}

export default class Meld {
    meldType: MeldType;
    tiles: Tile[];

    constructor(type: MeldType, ...tiles: Tile[]) {
        this.meldType = type;
        if ((this.isPung() || this.isSoeng()) && tiles.length != 3)
            throw Error(`InvalidTilesCountException: Is meld of Pung/Soeng, expected 3 tiles, only ${tiles.length}`);
        if (this.isGong() && tiles.length != 4)
            throw Error(`InvalidTilesCountException: Is meld of Gong, expected 4 tiles, only ${tiles.length}`);
        this.tiles = tiles;
    }

    static deserialize(obj: { a: number, b: number[] }): Meld {
        return new Meld(
            obj.a,
            ...obj.b.map((t: number) => Tile.deserialize(t))
        );
    }

    serialize(): { a: number, b: number[] } {
        return {
            a: this.meldType,
            b: this.tiles.map(t => t.serialize())
        };
    }

    gaaGong() {
        this.meldType = MeldType.GaaGong;
        this.tiles.push(this.tiles[0]);
    }

    first(): Tile {
        return this.tiles[0];
    }

    isPung(): boolean {
        return this.meldType === MeldType.Pung;
    }

    isSoeng(): boolean {
        return this.meldType === MeldType.Soeng;
    }

    isGong(): boolean {
        return this.meldType === MeldType.GaaGong ||
            this.meldType === MeldType.MingGong ||
            this.meldType === MeldType.AmGong;
    }

    isSeize(): boolean {
        return this.meldType === MeldType.Pung ||
            this.meldType === MeldType.Soeng ||
            this.meldType === MeldType.MingGong;
    }

    isPungOrGong(): boolean {
        return this.isPung() || this.isGong();
    }

    isNumeric(): boolean {
        return this.tiles[0].isNumeric();
    }

    isFaan(): boolean {
        return this.tiles[0].isFaan();
    }

    suit(): number {
        return this.tiles[0].suit;
    }

    toString(): string {
        return `${["上", "碰", "明槓", "加槓", "暗槓"][this.meldType]}[${this.tiles.toString()}]`;
    }
}
