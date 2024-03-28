import Tile from "@/types/Tile";
import EventType from "@/events/EventType";
import Meld from "@/types/Meld";

export default abstract class Event {

    eventType: EventType;

    protected constructor(eventType: EventType) {
        this.eventType = eventType;
    }

    serialize(): any {
        return JSON.stringify(this, (k, v) => {
            if (v instanceof Tile) {
                return {_c: "t", _v: v.serialize()};
            }
            if (v instanceof Meld) {
                return {_c: "m", _v: v.serialize()};
            }
            return v;
        });
    };

    static deserialize(obj: any): Event {
        return JSON.parse(obj, (k, v) => {
            if (v instanceof Object && "_c" in v) {
                switch (v._c) {
                    case "t":
                        return Tile.deserialize(v._v);
                    case "m":
                        return Meld.deserialize(v._v);
                }
            }
            return v;
        });
    };
}
