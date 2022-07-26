import Meld from "./Meld";
import Tile from "./Tile";

export default class GameStatus {
    fung: number;
    guk: number;
    players: {
        hotbar: Tile[],
        drew: Tile,
        melds: Meld[],
        flowers: Tile[],
        discards: Tile[],
        hasLichi: boolean
    }[];
    tileRemaining: number;

    constructor(players: { hotbar: Tile[]; drew: Tile; melds: Meld[]; flowers: Tile[]; discards: Tile[]; hasLichi: boolean }[], tileRemaining: number) {
        this.players = players;
        this.tileRemaining = tileRemaining;
    }

    serialize() {
        return [
            this.players.map(p => [
                p.hotbar.serialize(),
                p.drew ? p.drew.serialize() : null,
                p.melds.serialize(),
                p.flowers.serialize(),
                p.discards.serialize(),
                p.hasLichi
            ]),
            this.tileRemaining
        ];
    }

    static deserialize(obj: any) {
        const [players, tileRemaining] = obj;

        return new GameStatus(
            players.map((o: any[]) => {
                const [hotbar, drew, melds, flowers, discards, hasLichi] = o;
                return {
                    hotbar: hotbar.map((o: any) => Tile.deserialize(o)),
                    drew: drew ? Tile.deserialize(drew) : null,
                    melds: melds.map((o: any) => Meld.deserialize(o)),
                    flowers: flowers.map((o: any) => Tile.deserialize(o)),
                    discards: discards.map((o: any) => Tile.deserialize(o)),
                    hasLichi
                };
            }),
            tileRemaining
        );
    }
}
