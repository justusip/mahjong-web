import Event from "./Event";
import EventType from "@/events/EventType";

export default class GukStartEvent extends Event {
    constructor() {
        super(EventType.ON_GUK_START);
    }
}
