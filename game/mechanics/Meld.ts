
import Tile from "./Tile";

export enum MeldType {
    Soeng,
    Pung,
    MingGong,
    GaaGong,
    AmGong
}

export default class Meld {
    type: MeldType;
    tiles: Tile[];

    constructor(type: MeldType, tiles: Tile[]) {
        this.type = type;
        this.tiles = tiles;
    }

    static deserialize(obj: any): Meld {
        return new Meld(obj["type"], obj["tiles"].map((t: any) => Tile.deserialize(t)));
    }

    serialize(): any {
        return {
            "type": this.type,
            "tiles": this.tiles.map(t => t.serialize())
        };
    }

    isSeize() {
        return this.type === MeldType.Soeng || this.type === MeldType.Pung || this.type === MeldType.MingGong;
    }
}
