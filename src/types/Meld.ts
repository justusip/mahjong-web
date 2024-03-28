import Tile from "./Tile";

export enum MeldType {
    MingPung,
    AmPung, // Not in corner, only for calculating faan
    MingSoeng,
    AmSoeng, // Not in corner, only for calculating faan
    MingGong,
    GaaGong,
    AmGong,
    Unclassified // For Invalid melds
}

export default class Meld {
    meldType: MeldType;
    causedBy: number;
    tiles: Tile[];

    constructor(type: MeldType, causedBy: number, tiles: Tile[]) {
        this.meldType = type;
        this.causedBy = causedBy;
        if ((this.isPung() || this.isSoeng()) && tiles.length != 3)
            throw Error(`InvalidTilesCountException: Is meld of Pung/Soeng, expected 3 tiles, only ${tiles.length}`);
        if (this.isGong() && tiles.length != 4)
            throw Error(`InvalidTilesCountException: Is meld of Gong, expected 4 tiles, only ${tiles.length}`);
        this.tiles = tiles;
    }

    static deserialize(obj: { a: number, b: number, c: number[] }): Meld {
        return new Meld(
            obj.a,
            obj.b,
            obj.c.map((t: number) => Tile.deserialize(t))
        );
    }

    serialize(): { a: number, b: number, c: number[] } {
        return {
            a: this.meldType,
            b: this.causedBy,
            c: this.tiles.map(t => t.serialize())
        };
    }

    is(m: Meld | null): boolean {
        if (!m)
            return false;
        return this.meldType === m.meldType && this.tiles.matches(m.tiles);
    }

    gaaGong() {
        this.meldType = MeldType.GaaGong;
        this.tiles.push(this.tiles[0]);
    }

    first(): Tile {
        return this.tiles[0];
    }

    isPung(): boolean {
        return this.meldType === MeldType.MingPung || this.meldType === MeldType.AmPung;
    }

    isSoeng(): boolean {
        return this.meldType === MeldType.MingSoeng || this.meldType === MeldType.AmSoeng;
    }

    isGong(): boolean {
        return this.meldType === MeldType.GaaGong ||
            this.meldType === MeldType.MingGong ||
            this.meldType === MeldType.AmGong;
    }

    isSeize(): boolean {
        return this.meldType === MeldType.MingPung ||
            this.meldType === MeldType.MingSoeng ||
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
        return `${["碰", "暗碰", "上", "喑上", "明槓", "加槓", "暗槓"][this.meldType]}[${this.tiles.toString()}]`;
    }
}
