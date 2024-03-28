import KongGame from "@/server/logic/KongGame";
import Meld, {MeldType} from "@/types/Meld";
import Tile from "@/types/Tile";
import {RobotGhost} from "@/network/RobotGhost";

let g: KongGame;

beforeAll(() => {
    g = new KongGame([
        new RobotGhost(),
        new RobotGhost(),
        new RobotGhost(),
        new RobotGhost(),
    ]);
    g.resetGuk();
});

test("對對糊", () => {
    const p = g.players[0];
    p.flowers = Tile.parseList("");
    p.melds = [
        // new Meld(MeldType.Soeng, ...Tile.parseList("t1 t2 t3")),
        new Meld(MeldType.AmGong, p.seatingId, [...Tile.parseList("m5 m5 m5 m5")]),
        new Meld(MeldType.AmGong, p.seatingId, [...Tile.parseList("m6 m6 m6 m6")]),
        new Meld(MeldType.AmGong, p.seatingId, [...Tile.parseList("m7 m7 m7 m7")]),
        new Meld(MeldType.AmGong, p.seatingId, [...Tile.parseList("m8 m8 m8 m8")]),
    ];
    p.wall = Tile.parseList("f1");
    const extraTile = Tile.parse("f1");
    console.log(p.flowers.toString() + p.melds.toString() + " L " + p.wall.toString() + " + " + extraTile);
    const hands = g.getAvailHands(p, extraTile);
    console.log(hands);
});
