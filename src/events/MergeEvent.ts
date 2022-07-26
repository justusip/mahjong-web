import EventData from "./EventData";
import {GameEventType} from "./GameEventType";
import Meld from "../types/Meld";

export default class MergeEvent extends EventData {
    pid: number;
    meld: Meld;

    constructor(pid: number, meld: Meld) {
        super(GameEventType.MERGE);
        this.pid = pid;
        this.meld = meld;
    }

    serialize(): unknown {
        return [
            this.pid,
            this.meld.serialize()
        ];
    }

    static deserialize(obj: [
        pid: number,
        meld: { a: number, b: number[] },
    ]) {
        const [pid, meld] = obj;
        return new MergeEvent(
            pid,
            Meld.deserialize(meld)
        );
    }
}
