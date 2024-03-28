import Event from "./Event";
import Meld from "../types/Meld";
import EventType from "@/events/EventType";

export default class PlayerMergeEvent extends Event {
    pid: number;
    meld: Meld;

    constructor(pid: number, meld: Meld) {
        super(EventType.ON_PLAYER_MERGE);
        this.pid = pid;
        this.meld = meld;
    }
}
