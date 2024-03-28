// import Tile from "../types/Tile";
// import Game from "./Game";
// import Hand from "../hands/Hand";
// import Condition from "../models/Condition";
// import {MeldType} from "../types/Meld";
//
// export default class JapGame extends Game {
//
//     override canSik(c: Condition) {
//         if (c.sc) // 普通の役
//             return true;
//         if (c.all.distinct().every(t => c.all.occurrence(t) == 2)) //七対子
//             return true;
//         if (c.all.has(Tile.parseList("m1 m9 s1 s9 t1 t9 f1 f2 f3 f4 f5 f6 f7")) //國士無雙
//             && c.all.distinct().count(t => c.all.occurrence(t) === 2) === 1)
//             return true;
//         return false;
//     }
//
//     //TODO Most of them 副露減一翻
//     private static hands: Hand[] = [
//         //一飜の役
//         new Hand("立直", 1, c => {
//             return c.hasLichi;
//         }),
//         new Hand("一發", 1, c => {
//             return c.hasLichi && c.player.turnSinceLichi === 0;
//         }),
//         new Hand("門前清自摸", 1, c => {
//             return c.cornerMelds.isEmpty();
//         }),
//         new Hand("斷么九", 1, c => {
//             return c.all.every(t => !t.isJiuGau()); //TODO
//         }),
//         new Hand("平糊", 1, c => {
//             return c.sc && c.melds.every(s => s.isSoeng()); //TODO
//         }),
//         new Hand("一盃口", 1, c => {
//             if (!c.sc) return false;
//             const soengMelds = c.melds.filter(m => m.isSoeng());
//             const firsts = soengMelds.map(m => m.first());
//             return firsts.distinct().count(t => firsts.occurrence(t) >= 2) === 1;
//         }),
//         new Hand("役牌", 1, c => {
//             return false; //TODO
//         }),
//         new Hand("嶺上開花", 1, c => {
//             return false; //TODO
//         }),
//         new Hand("槍槓", 1, c => {
//             return false; //TODO
//         }),
//         new Hand("海底撈月", 1, c => {
//             return c.game.deck.length === 0 && c.game.getCurPlayer() === c.player;
//         }),
//         new Hand("河底撈魚", 1, c => {
//             return c.game.deck.length === 0 && c.game.getCurPlayer() !== c.player;
//         }),
//         new Hand("懸賞牌", 1, c => {
//             return false; //TODO
//         }),
//
//         //二飜の役
//         new Hand("三色同順", 2, c => {
//             if (!c.sc)
//                 return false;
//             const seonZis = c.melds.filter(s => s.isSoeng());
//             return seonZis.some(s => seonZis.count(ss => ss.first().rank === s.first().rank) >= 3);
//         }),
//         new Hand("三色同刻", 2, c => {
//             if (!c.sc)
//                 return false;
//             const dgzs = c.melds.filter(s => s.isPungOrGong());
//             return dgzs.some(s => dgzs.count(ss => ss.first().rank === s.first().rank) >= 3);
//         }),
//         new Hand("一氣通貫", 2, c => {
//             return c.sc &&
//                 c.melds.some(s => s.isSoeng() && s.first().rank === 0) &&
//                 c.melds.some(s => s.isSoeng() && s.first().rank === 3) &&
//                 c.melds.some(s => s.isSoeng() && s.first().rank === 6);
//         }),
//         new Hand("對對糊", 2, c => {
//             return c.sc &&
//                 c.melds.every(s => s.isPungOrGong());
//         }),
//         new Hand("三暗刻", 2, c => {
//             return c.sc &&
//                 c.melds.count(m => m.meldType === MeldType.AmPung || m.meldType === MeldType.AmGong) === 3;
//         }),
//         new Hand("三槓子", 2, c => {
//             return c.sc &&
//                 c.melds.count(m => m.isGong()) === 3;
//         }),
//         new Hand("七對子", 2, c => {
//             return c.sc &&
//                 c.all.distinct().every(m => c.all.occurrence(m) == 2);
//         }),
//         new Hand("混全帶么九", 2, c => {
//             return c.sc &&
//                 c.melds.every(m => m.tiles.some(t => t.isJiuGau())) &&
//                 c.eyes[0].isJiuGau() &&
//                 c.all.count(t => t.isFaan()) > 0 &&
//                 c.melds.count(m => m.isSoeng()) > 0;
//         }),
//         new Hand("混老頭", 2, c => {
//             return c.sc &&
//                 c.melds.every(m => m.tiles.some(t => t.isJiuGau())) &&
//                 c.eyes[0].isJiuGau() &&
//                 c.all.count(t => t.isFaan()) > 0 &&
//                 c.melds.count(m => m.isSoeng()) === 0;
//         }),
//         new Hand("小三元", 2, c => {
//             return c.sc &&
//                 c.melds.count(s => s.first().isSaamJyun()) === 2 &&
//                 c.eyes[0].isSaamJyun();
//         }, ["紅中", "發財", "白板"]),
//         new Hand("雙立直", 2, c => {
//             return c.player.turn === 0 && c.hasLichi;
//         }),
//
//         //三飜の役
//         new Hand("混一色", 3, c => {
//             return c.sc &&
//                 c.all.count(t => t.isFaan()) > 0 &&
//                 c.all.filter(t => t.isNumeric()).distinctlyOne(s => s.suit);
//         }),
//         new Hand("純全帶么九", 3, c => {
//             return c.sc &&
//                 c.melds.every(m => m.tiles.some(t => t.isCingJiu())) &&
//                 c.eyes[0].isCingJiu();
//         }),
//         new Hand("二盃口", 3, c => {
//             if (!c.sc) return false;
//             const soengMelds = c.melds.filter(m => m.isSoeng());
//             const firsts = soengMelds.map(m => m.first());
//             return firsts.distinct().count(t => firsts.occurrence(t) >= 2) === 2;
//         }),
//
//         //六飜の役
//         new Hand("清一色", 6, c => {
//             return c.sc && c.all.distinctlyOne(t => t.suit);
//         }),
//         //役滿（十三飜）の役
//         new Hand("國士無雙", 13, c => {
//             const comb = Tile.parseList("m1 m9 s1 s9 t1 t9 f1 f2 f3 f4 f5 f6 f7");
//             return c.all.has(comb) && c.hotbar.distinct().some(t => c.hotbar.occurrence(t) === 2);
//         }),
//
//         new Hand("國士無雙叫十三扉", 13, c => {
//             const comb = Tile.parseList("m1 m9 s1 s9 t1 t9 f1 f2 f3 f4 f5 f6 f7");
//             return c.hotbar.matches(comb) && comb.has([c.extraTile]);
//         }),
//
//         new Hand("大三元", 13, c => {
//             return c.sc && c.melds.count(s => s.first().isSaamJyun()) === 3;
//         }, ["紅中", "發財", "白板"]),
//
//         new Hand("四暗刻", 13, c => {
//             return c.sc && c.melds.every(s => s.meldType === MeldType.AmGong);
//         }, ["對對糊"]),
//
//         new Hand("字一色", 13, c => {
//             return c.sc && c.all.every(t => t.isFaan());
//         }),
//
//         new Hand("綠一色", 13, c => {
//             return c.sc && c.all.every(t => t.isGreen());
//         }),
//
//         new Hand("小四喜", 13, c => {
//             return c.sc && c.melds.count(s => s.first().isSeiHei()) === 3 && c.eyes[0].isSeiHei();
//         }, ["東圈風", "南圈風", "西圈風", "北圈風", "東門風", "南門風", "西門風", "北門風"]),
//
//         new Hand("大四喜", 13, c => {
//             return c.sc && c.melds.count(s => s.first().isSeiHei()) === 4;
//         }, ["東圈風", "南圈風", "西圈風", "北圈風", "東門風", "南門風", "西門風", "北門風"]),
//
//         new Hand("清老頭", 13, c => {
//             return c.sc && c.melds.every(s => s.isPungOrGong()) && c.all.every(t => t.isCingJiu());
//         }),
//
//         new Hand("九蓮寶燈", 13, c => {
//             if (!c.sc) return false;
//             if (!c.cornerMelds.isEmpty()) return false;
//             if (!c.all[0].isNumeric()) return false;
//             const tray = [...c.all];
//             for (const m of [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 8]) {
//                 const k = tray.find(n => n.suit === c.all[0].suit && n.rank === m);
//                 if (!k)
//                     return false;
//                 tray.splice(tray.indexOf(k), 1);
//             }
//             return true;
//         }, ["清一色", "門前清"]),
//
//         //TODO
//         // new Hand("純正九蓮寶燈", 13, c => {
//         //     if (!c.sc) return false;
//         //     if (!c.cornerMelds.isEmpty()) return false;
//         //     if (!c.all[0].isNumeric()) return false;
//         //     const tray = [...c.all];
//         //     for (const m of [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 8]) {
//         //         const k = tray.find(n => n.suit === c.all[0].suit && n.rank === m);
//         //         if (!k)
//         //             return false;
//         //         tray.splice(tray.indexOf(k), 1);
//         //     }
//         //     return true;
//         // }, ["清一色", "門前清"]),
//
//         new Hand("四槓子", 13, c => {
//             return c.sc && c.melds.every(s => s.isGong());
//         }, ["對對糊"]),
//
//         new Hand("天糊", 13, c => {
//             return c.player.isZong() && c.player.turn === 0;
//         }),
//
//         new Hand("地糊", 13, c => {
//             return c.player.isHaan() && c.player.turn === 0;
//         }),
//     ].sort((a, b) => b.points - a.points);
//
//     override hands(): Hand[] {
//         return JapGame.hands;
//     }
// }
