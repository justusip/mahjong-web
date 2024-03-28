import Event from "./Event";
import EventType from "@/events/EventType";

export default class GukEndEvent extends Event {
    draw: boolean;
    scores: number[];
    scoreDiff: number[];
    siks: {
        pid: number;
        extraTileFrom: number;
        hands: {
            name: string,
            points: number
        }[];
        faan: number;
    }[];

    constructor(draw: boolean, scores: number[], scoreDiff: number[], siks: { pid: number; extraTileFrom: number; hands: { name: string; points: number }[]; faan: number }[]) {
        super(EventType.ON_GUK_END);
        this.draw = draw;
        this.scores = scores;
        this.scoreDiff = scoreDiff;
        this.siks = siks;
    }


    isZimo() {
        if (this.draw)
            return false;
        if (this.siks.length !== 1)
            return false;
        if (this.siks[0].extraTileFrom === this.siks[0].pid)
            return true;
        return false;
    }

    isLamJong() {
        return this.isZimo();
    }

}
