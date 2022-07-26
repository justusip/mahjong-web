import {GameEventType} from "./GameEventType";

export default abstract class EventData {
    eventType: GameEventType;

    constructor(eventType: GameEventType) {
        this.eventType = eventType;
    }

    serialize(): any {
        return null;
    };

    static deserialize(obj: any): InstanceType<typeof this> {
        return null;
    };
}
