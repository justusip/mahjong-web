import prompts from "prompts";

import Player from "./Player";
import PlayerDiscardEvent from "@/events/PlayerDiscardEvent";
import PlayerDrewEvent from "@/events/PlayerDrewEvent";
import GukEndEvent from "@/events/GukEndEvent";
import GukStartEvent from "@/events/GukStartEvent";
import PlayerMergeEvent from "@/events/PlayerMergeEvent";
import Meld from "@/types/Meld";
import Tile from "@/types/Tile";
import Decision from "../models/Decision";
import DecisionType from "../models/DecisionType";
import Game from "@/server/logic/Game";
import GameStartEvent from "@/events/GameStartEvent";

export default class ConsolePlayer extends Player {

    override onGameStart(e: GameStartEvent): void {
        console.log("──────────────────────────────────────────────────────────────────────────────────────────");
        console.log(`歡迎加入房間。`);
        console.log(`玩家列表: ${this.game.players.map(p => `${p.name} (${p.uuid})`).join("、")}。`);
        console.log(`我係P${this.seatingId}。`);
        console.log("──────────────────────────────────────────────────────────────────────────────────────────");
    }

    override async decideReady(): Promise<void> {
        // await prompts({
        //     type: "text",
        //     name: "ready",
        //     message: "準備好請撳[ENTER]。"
        // });
    }

    override onGukStart(e: GukStartEvent) {
        super.onGukStart(e);
        console.log("──────────────────────────────────────────────────────────────────────────────────────────");
        console.log(`開始新局。`);
        const directions = "東南西北".split("");
        console.log(`今局係${directions[this.game.fung]}風${directions[this.game.guk]}局。`);
        console.log("──────────────────────────────────────────────────────────────────────────────────────────");
    }

    renderWalls() {
        console.log("──────────────────────────────────────────────────────────────────────────────────────────");
        for (const p of this.game.players) {
            const corner = [
                ...p.melds.flat(),
                ...p.flowers
            ];
            console.log(`P${p.seatingId} ${this.seatingId === p.seatingId ? "(你)" : `    `} [${this.game.players[p.seatingId].drew || "    "}] `
                + `${p.wall.join("|")}L${corner.join("|")}`);
        }
        console.log("──────────────────────────────────────────────────────────────────────────────────────────");
    }

    renderDiscards() {
        console.log("臺中間 » " + [...this.game.discards].reverse().join(", "));
    }

    override onPlayerDrew(e: PlayerDrewEvent): void {
        this.renderWalls();
    }

    override async decideDiscard(): Promise<Tile> {
        const answer = await prompts({
            type: "select",
            name: "selection",
            message: "出邊隻？",
            choices: [
                this.drew,
                ...this.wall,
            ].filter(o => o !== null)
                .map((o, i) => ({
                    title: i === 0 ? `[${o!.toString()}]` : ` ${o!.toString()} `,
                    value: o
                }))
        });
        return answer["selection"];
    }

    override onPlayerDiscard(e: PlayerDiscardEvent) {
        this.renderDiscards();
    }

    override async decidePrompt(availMelds: Meld[], availSik: boolean): Promise<Decision> {
        const actions = [
            availMelds && availMelds.find(m => m.isPung()) && "碰",
            availMelds && availMelds.find(m => m.isSoeng()) && "上",
            availMelds && availMelds.find(m => m.isGong()) && "槓",
            availSik && "食糊"
        ];
        console.log(`有得${actions.filter(o => o).join("或")}。你想做乜？`);
        const choices = [];
        if (availSik)
            choices.push({
                title: "食糊",
                value: {decision: DecisionType.EAT}
            });
        if (!availMelds.isEmpty())
            choices.push(
                ...availMelds.map(t => ({
                    title: t.toString(),
                    value: {
                        decision: DecisionType.MERGE,
                        selectedMeld: t
                    }
                }))
            );
        choices.push({
            title: "唔理",
            value: {decision: DecisionType.PASS}
        });
        const answer = await prompts({
            type: "select",
            name: "selection",
            message: "想做咩？",
            choices: choices
        });
        return answer.selection;
    }

    override onPlayerMerge(e: PlayerMergeEvent): void {
        console.log(`P${e.pid} ${e.meld.toString()}。`);
    }

    override onGukEnd(e: GukEndEvent): void {
        console.log("──────────────────────────────────────────────────────────────────────────────────────────");
        console.log("局終。");
        if (e.draw) {
            console.log("呢局打和。");
        } else {
            const sik = e.siks[0];
            console.log(
                e.isZimo() ?
                    `P${sik.pid}自摸。` :
                    `P${sik.pid}食糊（P${sik.extraTileFrom}出銃）。`
            );
            console.log("食糊牌型：" + sik.hands.join("、"));
            console.log(`共${sik.faan}番。`);
        }
        console.log(`分數：${e.scores.map((n, i) => `${n} (${e.scoreDiff[i]})`).join("、")}`);
        console.log("──────────────────────────────────────────────────────────────────────────────────────────");
    }
}
