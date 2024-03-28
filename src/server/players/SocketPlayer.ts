import {Socket} from "socket.io";

import Player from "./Player";
import Event from "@/events/Event";
import Meld from "@/types/Meld";
import Tile from "@/types/Tile";
import Decision from "../models/Decision";
import DecisionType from "../models/DecisionType";
import EventType from "@/events/EventType";
import GameSyncEvent from "@/events/GameSyncEvent";

export default class SocketPlayer extends Player {
    socket: Socket | null = null;

    attach(socket: Socket) {
        this.socket = socket;
        this.socket.on("disconnect", () => {
            this.socket = null;
        });
        this.socket.on(EventType.REQUEST_GAME_SYNC, async () => {
            if (!this.game)
                return;

            // Prevent player from sync game state before guk is started
            if (!this.game.players[0]?.wall) //TODO
                return;

            await this.onEvent(GameSyncEvent.capture(this.game));
        });
    }

    override async onEvent(e: Event): Promise<void> {
        super.onEvent(e);
        if (this.socket) {
            this.socket.emit(
                e.eventType,
                e.serialize()
            );
        }
    }

    override async decideReady(): Promise<void> {
        if (!this.socket)
            return;
        return await new Promise<void>(resolve => {
            this.socket!.once(EventType.DECIDE_READY,
                () => {
                    resolve();
                });
        });
    }

    override async decideDiscard(): Promise<Tile> {
        if (!this.socket) {
            return this.wall[0];
        }

        // If socket detached:
        // return [this.curDrewTile, ...this.hotbar].find(o => o !== null);
        return await new Promise<Tile>(resolve => {
            this.socket!.emit(
                EventType.DECIDE_DISCARD
            );
            this.socket!.once(
                EventType.DECIDE_DISCARD,
                (
                    t: number
                ) => {
                    const tile = Tile.deserialize(t);
                    resolve(tile);
                }
            );
        });
    }

    override async decidePrompt(availMelds: Meld[], availSik: boolean): Promise<Decision> {
        if (!this.socket) {
            if (availSik)
                return {decision: DecisionType.EAT};
            return {
                decision: DecisionType.MERGE,
                selectedMeld: availMelds.first()!
            };
        }

        const decision = await new Promise<Decision>(resolve => {
            this.socket!.emit(
                EventType.DECIDE_PROMPT,
                availMelds.map(m => m.serialize()),
                availSik
            );
            this.socket!.once(
                EventType.DECIDE_PROMPT,
                (decision: number) => {
                    switch (decision) {
                        case -2:
                            resolve({decision: DecisionType.PASS});
                            return;
                        case -1:
                            resolve({decision: DecisionType.EAT});
                            return;
                        default:
                            resolve({
                                decision: DecisionType.MERGE,
                                selectedMeld: availMelds[decision]
                            });
                            return;
                    }
                }
            );
        });
        return decision;
    }

}
