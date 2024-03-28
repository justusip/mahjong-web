import Player from "./Player";
import Meld from "@/types/Meld";
import Tile from "@/types/Tile";
import Decision from "../models/Decision";
import DecisionType from "../models/DecisionType";
import {ms} from "@/utils/AsyncUtils";
import GukStartEvent from "@/events/GukStartEvent";

export default class RobotPlayer extends Player {
    readonly delay = 1;
    preferedType = 0;

    override onGukStart(e: GukStartEvent) {
        this.preferedType = Array(3)
            .fill(0)
            .map((_, i) => this.wall.filter(t => t.suit === i))
            .sort((a, b) => a.length - b.length)
            .reverse()[0][0].suit;
    }

    override async decideDiscard(): Promise<Tile> {
        await ms(this.delay);
        let tray = [...this.wall];
        if (this.drew !== null)
            tray.push(this.drew);

        if (tray.some(t => this.preferedType !== t.suit)) {
            tray = tray.filter(t => this.preferedType !== t.suit);
            if (tray.some(t => t.suit !== 3))
                return tray.filter(t => t.suit !== 3).random();
            else
                return tray.random();
        } else {
            return tray.random();
        }
    }

    override async decidePrompt(availMelds: Meld[], availSik: boolean): Promise<Decision> {
        await ms(this.delay);

        if (availSik)
            return {decision: DecisionType.EAT};

        //TODO Prefer Pung instead of Soeng
        if (!availMelds.isEmpty()) {
            const prefered = availMelds.filter(m => m.suit() === this.preferedType || m.suit() === 3);
            if (!prefered.isEmpty()) {
                return {decision: DecisionType.MERGE, selectedMeld: prefered.sort(o => o.tiles.length).reverse()[0]};
            }
        }
        return {decision: DecisionType.PASS};
    }
}
