import Event from "./Event";
import EventType from "@/events/EventType";

export default class GameEndEvent extends Event {
    constructor() {
        super(EventType.ON_GAME_END);
    }
}
