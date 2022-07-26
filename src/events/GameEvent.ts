import EventData from "./EventData";
import {GameEventType} from "./GameEventType";
import GameStatus from "../types/GameStatus";

export default class GameEvent<T extends EventData = EventData> {
    id: number;
    gameStatus: GameStatus;
    data: T;

    constructor(id: number, gameStatus: GameStatus, data: T) {
        this.id = id;
        this.gameStatus = gameStatus;
        this.data = data;
    }

    eventType(): GameEventType {
        return this.data.eventType;
    }
}

