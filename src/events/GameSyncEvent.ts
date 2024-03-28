import Game from "@/server/logic/Game";
import Tile from "@/types/Tile";
import Meld, {MeldType} from "@/types/Meld";
import EventType from "@/events/EventType";
import Event from "@/events/Event";

export default class GameSyncEvent extends Event {
    fung: number;
    guk: number;
    players: {
        uuid: string,
        name: string,
        wall: Tile[],
        drew: Tile,
        melds: Meld[],
        flowers: Tile[],
        discards: Tile[],
        hasLichi: boolean
    }[];
    tileRemaining: number;

    constructor(fung: number, guk: number, players: {
        uuid: string;
        name: string;
        wall: Tile[];
        drew: Tile;
        melds: Meld[];
        flowers: Tile[];
        discards: Tile[];
        hasLichi: boolean
    }[], tileRemaining: number) {
        super(EventType.ON_GAME_SYNC);
        this.fung = fung;
        this.guk = guk;
        this.players = players;
        this.tileRemaining = tileRemaining;
    }

    static capture(game: Game) {
        return new GameSyncEvent(
            game.fung,
            game.guk,
            game.players.map(p => ({
                uuid: p.uuid,
                name: p.name,
                wall: p.wall,
                drew: p.drew,
                melds: p.melds,
                flowers: p.flowers,
                discards: p.discards,
                hasLichi: p.hasLichi
            })),
            game.deck.length
        );
    }

    static sample() {
        return new GameSyncEvent(
            0,
            0,
            [...Array(4)].map(() => ({
                uuid: "sdfjsdjlf",
                name: "owo",
                wall: Tile.parseList("b2 b2 b2 b3 b4 b5"),
                drew: Tile.parse("b2"),
                melds: [
                    new Meld(MeldType.MingGong, 1, Tile.parseList("a1 a1 a1 a1")),
                    new Meld(MeldType.MingSoeng, 1, Tile.parseList("a4 a5 a6"))
                ],
                flowers: Tile.parseList("w1 w2 w3 w4 w5 w6 w7 w8"),
                discards: Tile.parseList("c2 c3 c4 c8 c1 d2 d6 d8 d1 a1 a4 a6 a2 b2 b3"),
                hasLichi: false
            })),
            0
        );
    }
}
