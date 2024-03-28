import Event from "./Event";
import Tile from "../types/Tile";
import EventType from "@/events/EventType";

export default class PlayerDiscardEvent extends Event {
    pid: number;
    tile: Tile;

    constructor(pid: number, tile: Tile) {
        super(EventType.ON_PLAYER_DISCARD);
        this.pid = pid;
        this.tile = tile;
    }
}
