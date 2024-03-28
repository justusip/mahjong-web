import Event from "./Event";
import Tile from "../types/Tile";
import EventType from "@/events/EventType";

export default class PlayerDrewEvent extends Event {
    pid: number;
    tile: Tile;

    constructor(pid: number, tile: Tile) {
        super(EventType.ON_PLAYER_DREW);
        this.pid = pid;
        this.tile = tile;
    }
}
