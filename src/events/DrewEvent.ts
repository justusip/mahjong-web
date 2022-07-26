import EventData from "./EventData";
import {GameEventType} from "./GameEventType";
import Tile from "../types/Tile";

export default class DrewEvent extends EventData {
    pid: number;
    tile: Tile;

    constructor(pid: number, tile: Tile) {
        super(GameEventType.DREW);
        this.pid = pid;
        this.tile = tile;
    }

    serialize(): unknown {
        return [
            this.pid,
            this.tile.serialize()
        ];
    }

    static deserialize(obj: [
        pid: number,
        tile: number,
    ]) {
        const [pid, tile] = obj;
        return new DrewEvent(
            pid,
            Tile.deserialize(tile)
        );
    }
}
