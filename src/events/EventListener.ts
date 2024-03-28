import GameStartEvent from "@/events/GameStartEvent";
import GukStartEvent from "@/events/GukStartEvent";
import PlayerDrewEvent from "@/events/PlayerDrewEvent";
import PlayerDiscardEvent from "@/events/PlayerDiscardEvent";
import PlayerMergeEvent from "@/events/PlayerMergeEvent";
import PlayerRichiEvent from "@/events/PlayerRichiEvent";
import GukEndEvent from "@/events/GukEndEvent";
import GameEndEvent from "@/events/GameEndEvent";
import Event from "@/events/Event";
import EventType from "@/events/EventType";
import {Socket} from "socket.io-client";
import GameSyncEvent from "@/events/GameSyncEvent";

export default class EventListener {

    readonly listenerFunctions: [EventType, (e: Event & any) => void][] = [
        [EventType.ON_GAME_START, this.onGameStart],
        [EventType.ON_GAME_SYNC, this.onGameSync],
        [EventType.ON_GUK_START, this.onGukStart],
        [EventType.ON_PLAYER_DREW, this.onPlayerDrew],
        [EventType.ON_PLAYER_DISCARD, this.onPlayerDiscard],
        [EventType.ON_PLAYER_MERGE, this.onPlayerMerge],
        [EventType.ON_PLAYER_RICHI, this.onPlayerRichi],
        [EventType.ON_GUK_END, this.onGukEnd],
        [EventType.ON_GAME_END, this.onGameEnd],
    ].map(([eventType, listener]) => {
        // Need to apply .bind(this) to every functions
        return [eventType as EventType, (listener as (e: Event) => void).bind(this)];
    });

    readonly socketListener = (rawEvent: any) => {
        if (!rawEvent)
            return;
        const e = Event.deserialize(rawEvent);
        if (e)
            console.log(`onEvent: ${JSON.stringify(e)}`);
        else
            console.log(`onEvent: ?`);
        this.onEvent(e);
    };

    regSocket(socket: Socket) {
        for (const [eventType, listener] of this.listenerFunctions)
            socket.on(eventType, this.socketListener);
    }

    unregSocket(socket: Socket) {
        for (const [eventType, listener] of this.listenerFunctions)
            socket.removeListener(eventType, this.socketListener);
    }

    onEvent(e: Event): void {
        for (const [eventType, listener] of this.listenerFunctions) {
            if (e.eventType === eventType) {
                listener(e);
                return;
            }
        }
    }

    onGameStart(e: GameStartEvent): void {

    }

    onGameSync(e: GameSyncEvent): void {

    }

    onGukStart(e: GukStartEvent): void {

    }

    onPlayerDrew(e: PlayerDrewEvent): void {

    }

    onPlayerDiscard(e: PlayerDiscardEvent): void {

    }

    onPlayerMerge(e: PlayerMergeEvent): void {

    }

    onPlayerRichi(e: PlayerRichiEvent): void {

    }

    onGukEnd(e: GukEndEvent): void {

    }

    onGameEnd(e: GameEndEvent): void {

    }
}