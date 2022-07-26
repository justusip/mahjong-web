import EventData from "./EventData";
import {GameEventType} from "./GameEventType";

export default class GukEndEvent extends EventData {
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
        super(GameEventType.END);
        this.draw = draw;
        this.scores = scores;
        this.scoreDiff = scoreDiff;
        this.siks = siks;
    }

    serialize(): unknown {
        return [
            this.draw,
            this.scores,
            this.scoreDiff,
            this.siks.map(o => [
                o.pid,
                o.extraTileFrom,
                o.hands.map(o => [o.name, o.points]),
                o.faan,
            ])
        ];
    }

    static deserialize(obj: [
        draw: boolean,
        scores: number[],
        scoreDiff: number[],
        siks: [
            pid: number,
            extraTileFrom: number,
            hands: [
                name: string,
                points: number
            ][],
            faan: number
        ][]
    ]) {
        const [draw, scores, scoreDiff, siks] = obj;
        return new GukEndEvent(
            draw,
            scores,
            scoreDiff,
            siks.map(o => {
                const [pid, extraTileFrom, hands, faan] = o;
                return {
                    pid,
                    extraTileFrom,
                    hands: hands.map(o => {
                        const [name, points] = o;
                        return {name, points};
                    }),
                    faan
                };
            })
        );
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
