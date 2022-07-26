import EventData from "./EventData";
import {GameEventType} from "./GameEventType";
import Tile from "../types/Tile";

export default class DiscardEvent extends EventData {
    pid: number;
    tile: Tile;

    constructor(pid: number, tile: Tile) {
        super(GameEventType.DISCARD);
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
        return new DiscardEvent(
            pid,
            Tile.deserialize(tile)
        );
    }
}
