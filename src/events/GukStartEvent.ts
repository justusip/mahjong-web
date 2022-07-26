import EventData from "./EventData";
import {GameEventType} from "./GameEventType";

export default class GukStartEvent extends EventData {
    fung: number;
    guk: number;

    constructor(fung: number, guk: number) {
        super(GameEventType.START);
        this.fung = fung;
        this.guk = guk;
    }

    serialize(): unknown {
        return [
            this.fung,
            this.guk
        ];
    }

    static deserialize(obj: [
        fung: number,
        guk: number
    ]) {
        const [fung, guk] = obj;
        return new GukStartEvent(
            fung,
            guk
        );
    }
}
