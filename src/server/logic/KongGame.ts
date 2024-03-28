import Game from "./Game";
import Tile from "@/types/Tile";
import Hand from "../models/Hand";
import Condition from "../models/Condition";

export default class KongGame extends Game {

    override canSik(c: Condition) {
        if (c.isSC) // 雞糊
            return true;
        if (c.flowers.length >= 7) // 花糊、八仙過海
            return true;
        if (c.all.has(Tile.parseList("m1 m9 s1 s9 t1 t9 f1 f2 f3 f4 f5 f6 f7")) // 十三幺
            && c.all.distinct().count(t => c.all.occurrence(t) === 2) === 1)
            return true;
        return false;
    }

    // This list of hands is reversely sorted by their points.
    // i.e., if hand A has conflict with B, the hand with higher point will be kept.
    private static hands: Hand[] = [
        new Hand("平糊", 1, c => {
            return c.isSC &&
                c.melds!.every(s => s.isSoeng());
        }),

        new Hand("對對糊", 3, c => {
            return c.isSC &&
                c.melds!.every(s => s.isPungOrGong());
        }),

        new Hand("混一色", 3, c => {
            return c.isSC &&
                c.all.count(t => t.isFaan()) > 0 &&
                c.all.filter(t => t.isNumeric()).distinctlyOne(s => s.suit);
        }),

        //坎坎糊：冇碰、槓過嘅對對糊（暗槓都唔不可以）
        new Hand("坎坎糊", 8, c => {
            return c.isSC &&
                c.melds!.every(s => s.isPungOrGong()) &&
                c.cornerMelds.isEmpty();
        }, ["門前清", "對對糊"]),

        new Hand("清一色", 7, c => {
            return c.isSC &&
                c.all.distinctlyOne(t => t.suit);
        }),

        new Hand("字一色", 10, c => {
            return c.isSC &&
                c.all.every(t => t.isFaan());
        }, ["對對糊"]),

        new Hand("花幺九", 1, c => {
            return c.isSC &&
                c.melds!.every(s => s.isPungOrGong()) &&
                c.all.every(t => t.isJiuGau()) &&
                c.all.count(s => s.isFaan()) > 0 &&
                c.all.count(s => s.isCingJiu()) > 0;
        }),

        new Hand("清幺九", 10, c => {
            return c.isSC &&
                c.melds!.every(s => s.isPungOrGong()) &&
                c.all.every(t => t.isCingJiu());
        }, ["對對糊"]),

        new Hand("小三元", 5, c => {
            return c.isSC &&
                c.melds!.count(s => s.first().isSaamJyun()) === 2 &&
                c.eyes![0].isSaamJyun();
        }, ["紅中", "發財", "白板"]),

        new Hand("大三元", 8, c => {
            return c.isSC &&
                c.melds!.count(s => s.first().isSaamJyun()) === 3;
        }, ["紅中", "發財", "白板"]),

        new Hand("小四喜", 6, c => {
            return c.isSC &&
                c.melds!.count(s => s.first().isSeiHei()) === 3 &&
                c.eyes![0].isSeiHei();
        }, ["東圈風", "南圈風", "西圈風", "北圈風", "東門風", "南門風", "西門風", "北門風"]),

        new Hand("大四喜", 13, c => {
            return c.isSC &&
                c.melds!.count(s => s.first().isSeiHei()) === 4;
        }, ["東圈風", "南圈風", "西圈風", "北圈風", "東門風", "南門風", "西門風", "北門風"]),

        new Hand("九子連環", 10, c => {
            if (!c.isSC) return false;
            if (!c.cornerMelds.isEmpty()) return false;
            if (!c.all[0].isNumeric()) return false;
            const tray = [...c.all];
            for (const m of [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 8]) {
                const k = tray.find(n => n.suit === c.all[0].suit && n.rank === m);
                if (!k)
                    return false;
                tray.splice(tray.indexOf(k), 1);
            }
            return true;
        }, ["清一色", "門前清"]),

        new Hand("十三幺", 13, c => {
            return c.all.has(Tile.parseList("m1 m9 s1 s9 t1 t9 f1 f2 f3 f4 f5 f6 f7"))
                && c.all.distinct().count(t => c.all.occurrence(t) === 2) === 1;
        }),

        new Hand("十八羅漢", 13, c => {
            return c.isSC &&
                c.melds!.every(s => s.isGong());
        }, ["對對糊"]),

        new Hand("東圈風", 1, c => c.hasPungziOf(3, 0) && c.game.fung === 0),
        new Hand("南圈風", 1, c => c.hasPungziOf(3, 1) && c.game.fung === 1),
        new Hand("西圈風", 1, c => c.hasPungziOf(3, 2) && c.game.fung === 2),
        new Hand("北圈風", 1, c => c.hasPungziOf(3, 3) && c.game.fung === 3),
        new Hand("東門風", 1, c => c.hasPungziOf(3, 0) && c.player.wrtFungId === 0),
        new Hand("南門風", 1, c => c.hasPungziOf(3, 1) && c.player.wrtFungId === 1),
        new Hand("西門風", 1, c => c.hasPungziOf(3, 2) && c.player.wrtFungId === 2),
        new Hand("北門風", 1, c => c.hasPungziOf(3, 3) && c.player.wrtFungId === 3),
        new Hand("紅中", 1, c => c.hasPungziOf(3, 4)),
        new Hand("發財", 1, c => c.hasPungziOf(3, 5)),
        new Hand("白板", 1, c => c.hasPungziOf(3, 6)),

        new Hand("門前清", 1, c => {
            return c.cornerMelds.isEmpty();
        }),

        new Hand("無花", 1, c => {
            return c.flowers.isEmpty();
        }),

        new Hand("正花", 1, c => {
            if (c.flowers.length >= 7)
                return false;
            return c.flowers.count(t => t.rank % 4 === c.player.wrtFungId) === 1;
        }),

        new Hand("雙正花", 2, c => {
            if (c.flowers.length >= 7)
                return false;
            return c.flowers.count(t => t.rank % 4 === c.player.wrtFungId) === 2;
        }),

        // 一臺花 is originally 2 faan, but we calculate it as 正花 (1 faan) + 一臺花 (1 faan)
        new Hand("一臺花", 1, c => {
            if (c.flowers.length >= 7)
                return false;
            const a = c.flowers.count(t => t.rank >= 0 && t.rank <= 3);
            const b = c.flowers.count(t => t.rank >= 4 && t.rank <= 7);
            return a === 4 || b === 4;
        }),

        new Hand("花糊", 3, c => { //TODO 補咗花就唔可以食糊
            return c.flowers.length === 7;
        }),

        new Hand("八仙過海", 8, c => { //TODO 補咗花就唔可以食糊
            return c.flowers.length === 8;
        }),

        new Hand("自摸", 1, c => {
            return c.game.getCurPlayer() === c.player;
        }),

        new Hand("天糊", 13, c => {
            return c.game.discards.isEmpty() &&
                c.game.fung === c.player.seatingId &&
                c.game.players.every(p => p.melds.isEmpty());
        }),

        new Hand("地糊", 13, c => {
            return c.game.discards.length === 1 &&
                c.game.fung !== c.player.seatingId &&
                c.game.players.every(p => p.melds.isEmpty());
        }),

        // 河底撈魚 not exist in Hong Kong mahjong.
        new Hand("海底撈月", 1, c => {
            return c.game.deck.length === 0 &&
                c.game.getCurPlayer() === c.player;
        }),

        new Hand("槓上自摸", 1, c => {
            return false; //TODO
        }),

        new Hand("搶槓", 1, c => {
            return false; //TODO
        }),
    ].sort((a, b) => b.points - a.points);

    override hands(): Hand[] {
        return KongGame.hands;
    }

}
