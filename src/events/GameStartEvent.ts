import Event from "./Event";
import EventType from "@/events/EventType";

export default class GameStartEvent extends Event {
    constructor() {
        super(EventType.ON_GAME_START);
    }
}
