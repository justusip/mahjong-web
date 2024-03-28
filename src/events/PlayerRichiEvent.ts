import Event from "./Event";
import EventType from "@/events/EventType";

export default class PlayerRichiEvent extends Event {
    pid: number;

    constructor(pid: number) {
        super(EventType.ON_PLAYER_RICHI);
        this.pid = pid;
    }
}