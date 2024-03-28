import PlayerDiscardEvent from "@/events/PlayerDiscardEvent";
import Tile from "@/types/Tile";
import GameState from "@/types/GameState";
import Meld, {MeldType} from "@/types/Meld";

import "@/utils/ArrayExt";

test('DiscardEvent', () => {
    const from = new PlayerDiscardEvent(1, new Tile(2, 1, 3));
    const to = PlayerDiscardEvent.deserialize(from.serialize() as any);
    expect(from).toStrictEqual(to);
});

test('DiscardEvent', () => {
    const from = new GameState(
        0,
        0,
        [...Array(4)].map(() => ({
                wall: Tile.parseList("b2 b2 b2 b3 b4 b5"),
                drew: Tile.parse("b2"),
                melds: [
                    new Meld(MeldType.MingGong, 1, Tile.parseList("a1 a1 a1 a1")),
                    new Meld(MeldType.MingSoeng, 1, Tile.parseList("a4 a5 a6"))
                ],
                flowers: Tile.parseList("w1 w2 w3 w4 w5 w6 w7 w8"),
                discards: [],
                hasLichi: false
            }),
            0),
        0
    );
    const to = GameState.deserialize(from.serialize() as any);
    expect(from).toStrictEqual(to);
});
