import PlayerDiscardEvent from "@/events/PlayerDiscardEvent";
import PlayerDrewEvent from "@/events/PlayerDrewEvent";
import Event from "@/events/Event";
import GukEndEvent from "@/events/GukEndEvent";
import GukStartEvent from "@/events/GukStartEvent";
import PlayerMergeEvent from "@/events/PlayerMergeEvent";
import Meld, {MeldType} from "@/types/Meld";
import Tile from "@/types/Tile";
import Hand from "../models/Hand";
import Condition from "../models/Condition";
import Decision from "../models/Decision";
import DecisionType from "../models/DecisionType";
import Deck from "../models/Deck";
import Player from "../players/Player";
import {ms} from "@/utils/AsyncUtils";
import GameStartEvent from "@/events/GameStartEvent";
import GameSyncEvent from "@/events/GameSyncEvent";

export default abstract class Game {
    gameEvents: Event[] = [];
    readonly players: Player[] = [];

    // Game.discards mirrors the 4 individual Player.discards. The contents should be the same.
    discards: Tile[];

    scores: number[];
    deck: Deck = new Deck();
    lastPlayerIdx: number;
    curPlayerIdx: number;

    fung = 0;
    guk = 0;

    constructor(players: Player[]) {
        if (players.length != 4)
            throw new Error("NotEnoughOrTooMuchPlayerException");
        this.players = players;
    }

    onGameEvent(event: Event) {
        this.gameEvents.push(event);
        this.players.forEach(p => {
            p.onEvent(event);
        });
    }

    public async runFull() {
        if (this.players.length != 4)
            throw new Error("NotEnoughPlayerException");

        // Determine player's seating arrangement
        this.players.shuffle();

        //TODO circular dependency - not very good!
        this.players.forEach((p, seatingId) => p.attachGameRef(this, seatingId));
        this.scores = [0, 0, 0, 0];

        this.onGameEvent(new GameStartEvent());

        for (this.fung = 0; this.fung < 1; this.fung++) {
            for (this.guk = 0; this.guk < 4; this.guk++) {
                await this.runGuk();
                const gukEndEvent = this.gameEvents.last() as GukEndEvent;
                if (gukEndEvent.isLamJong())
                    this.guk--;
            }
        }
    }

    async runGuk(): Promise<void> {
        let shdDrawTile = true;

        this.resetGuk();
        this.curPlayerIdx = this.guk;

        await Promise.all(this.players.map(p => p.decideReady()));
        this.onGameEvent(new GukStartEvent());
        this.onGameEvent(GameSyncEvent.capture(this));

        turn: while (!this.deck.isEmpty()) {
            const curPlayer = this.getCurPlayer();
            if (shdDrawTile) {
                await ms(100);

                // Draw a tile for the player
                this.drawTileForCurPlayer();

                // If the tile drawn is of the flower type, put it away and draw a tile again
                if (this.hasDrewFlower()) {
                    this.putAwayFlower();
                    shdDrawTile = true;
                    continue;
                }

                //九種九牌?
                if (this.isJap() && curPlayer.turn === 0 &&
                    [...curPlayer.wall, curPlayer.drew].count(t => !!t?.isJiuGau()) >= 9) {
                    //TODO
                }

                // Find all available zimo and gongs with respect to the tile that the player has just drawn.
                const availMelds = this.getAvailMelds(curPlayer, curPlayer.drew!, curPlayer);
                const availHands = this.getAvailHands(curPlayer, curPlayer.drew!);

                // Ask the player's if he/she wanna zimo, gong or pass, and process his/her decision.
                if (!availMelds.isEmpty() || !availHands.isEmpty()) {
                    const decision = await curPlayer.decidePrompt(availMelds, !availHands.isEmpty());
                    switch (decision.decision) {
                        case DecisionType.MERGE:
                            this.onMerge(curPlayer, decision.selectedMeld!);
                            shdDrawTile = true;
                            continue;
                        case DecisionType.EAT:
                            this.onSik(curPlayer, curPlayer.drew!, curPlayer, availHands);
                            return;
                    }
                }
            }

            const discardedTile = await curPlayer.decideDiscard();
            this.onDiscard(discardedTile!);
            this.lastPlayerIdx = this.curPlayerIdx;

            curPlayer.turn++;
            if (curPlayer.hasLichi)
                curPlayer.turnSinceLichi++;
            await ms(100);

            // TODO Coeng-Gong
            const decisions: ({
                player: Player,
                decision: Decision
            } | null)[] = await Promise.all(
                this.players.map(p =>
                    (async () => {
                        if (curPlayer === p)
                            return null;
                        const availMelds = this.getAvailMelds(p, discardedTile, curPlayer);
                        const availHands = this.getAvailHands(p, discardedTile);
                        if (availMelds.isEmpty() && availHands.isEmpty())
                            return null;
                        return {
                            player: p,
                            decision: await p.decidePrompt(availMelds, !availHands.isEmpty())
                        };
                    })()
                )
            );
            // If there are multiple players who are able to and decided to Sik-Wu simultaneously,
            // only the player more near the current player (下家) is allowed to Sik-Wu.
            // TODO give user the option to allow multiple Sik-Wus (一炮雙響) in his/her room, not only single Zit-Wu (截糊)
            for (let i = this.curPlayerIdx; i != (this.curPlayerIdx + 4 - 1) % 4; i = (i + 1) % 4) {
                const d = decisions[i];
                if (d && d.decision.decision === DecisionType.EAT) {
                    const availHands = this.getAvailHands(d.player, discardedTile);
                    this.onSik(d.player, discardedTile, curPlayer, availHands!);
                    return;
                }
            }
            // Handle Pung/Gong
            for (const d of
                decisions.filter(d =>
                    d &&
                    d.decision.decision === DecisionType.MERGE &&
                    d.decision.selectedMeld.isPungOrGong()
                )) {
                this.onMerge(d.player, d.decision.selectedMeld);
                shdDrawTile = d.decision.selectedMeld.isGong();
                this.curPlayerIdx = d.player.seatingId;
                continue turn;
            }
            // Handle Soeng
            for (const d of
                decisions.filter(d =>
                    d &&
                    d.decision.decision === DecisionType.MERGE &&
                    d.decision.selectedMeld.isSoeng())
                ) {
                this.onMerge(d.player, d.decision.selectedMeld);
                shdDrawTile = false;
                this.curPlayerIdx = d.player.seatingId;
                continue turn;
            }

            this.curPlayerIdx = (this.curPlayerIdx + 1) % 4;
            shdDrawTile = true;
        }
        this.onDraw();
    }

    resetGuk() {
        // 1) Resetting internal variables and stats
        this.curPlayerIdx = 0;
        this.discards = [];

        // 2) Resetting the deck
        this.deck.reset(true);
        this.deck.shuffle();

        // 3) Draw tiles for players and clear their inventory
        this.players.forEach(p => {
            p.wall = this.deck.drawSome(13);
            p.drew = null;
            p.melds = [];
            p.flowers = [];
            p.discards = [];
            p.hasLichi = false;
            p.turn = 0;
            p.turnSinceLichi = 0;
        });

        // 4) Put away flower tiles from all players
        this.players.forEach(p => {
            while (true) {
                // Find one flower tile. If it does not exist, then stop the loop.
                const flower = p.wall.find(o => o.isFlower());
                if (!flower)
                    break;

                // Moving the found flower tile from the player's inventory to the corner
                p.wall.remove([flower]);
                p.flowers.push(flower);

                // Drawing a new tile to reimburse the abandoned tile
                p.wall.push(this.deck.drawOne()!);
            }
        });

        // 5) Sorting inventories of all players
        this.players.forEach(p => {
            p.wall.properlySort();
        });

        //TODO TEMP
        // this.players[0].hotbar = new TileList(...Tile.parseList("m1 m1 m1 m2 m3 m4 m5 m5 m5 m6 m6 m6 m7"));
    }

    getCurPlayer(): Player {
        return this.players[this.curPlayerIdx];
    }

    isJap(): boolean {
        return false;
        // return this instanceof JapGame;
    }

    drawTileForCurPlayer() {
        const curPlayer = this.getCurPlayer();
        console.assert(!curPlayer?.drew);

        // 1) Get a tile from deck
        const tileDrawn = this.deck.drawOne();
        // 2) Set it as player's tile drew
        curPlayer!.drew = tileDrawn;

        // 3) Broadcast event
        // Hide the tile drew for other players, if it is not of flower
        this.onGameEvent(new PlayerDrewEvent(curPlayer!.seatingId!, curPlayer!.drew!));
    }

    hasDrewFlower() {
        const curPlayer = this.getCurPlayer();
        console.assert(curPlayer?.drew);

        return curPlayer.drew!.isFlower();
    }

    putAwayFlower() {
        const curPlayer = this.getCurPlayer();
        console.assert(curPlayer?.drew);

        curPlayer.flowers.push(curPlayer.drew!);
        curPlayer.drew = null;
    }

    onDiscard(selectedTile: Tile) {
        // If someone want to discard a tile, he is always the curPlayer
        const curPlayer = this.getCurPlayer();

        // TODO Cheating prevention should be done within the HumanPlayer class
        // ...

        // 1) If selected tile is within player's inventory, swap the tile with the one that has just drawn
        // Otherwise the selected tile is the tile drew, hence ignore
        if (curPlayer.wall.has([selectedTile])) {
            // 1.1) Remove selected tile from player's inventory
            curPlayer.wall.remove([selectedTile]);
            // 1.2) If a tile has been drawn, insert it into player's inventory, and
            if (curPlayer.drew !== null) {
                curPlayer.wall.push(curPlayer.drew);
                curPlayer.wall.properlySort();
            }
            // 1.3) Replace the tile drew as selected tile from player's inventory
            curPlayer.drew = selectedTile;
        }

        // 2) Discard tile drew to table
        curPlayer.discards.push(curPlayer.drew!);
        this.discards.push(curPlayer.drew!);
        curPlayer.drew = null;

        // 3) Broadcast event
        this.onGameEvent(new PlayerDiscardEvent(curPlayer.seatingId!, selectedTile));
    }

    /**
     * Finds all available melds of a player based the player's whole inventory and the extra tile (that have just been drawn or discarded by others).
     * The melds found does not necessarily have to involve the extra tile, i.e., they can be Am-Gong-Zi that can previously be made but ignored.
     *
     * @param player The player whose inventory to be looked at, either the current player when a tile have just drawn,
     * or the other players when a tile has just discarded by the current player.
     * @param extraTile The extra tile, either the tile that have just drawn, or the tile that has been just discarded.
     * @param extraTileFrom The player that the extra tile is from.
     *
     * @return The available melds of a player. Returns [] if none is found.
     */
    getAvailMelds(player: Player, extraTile: Tile, extraTileFrom: Player): Meld[] {
        // Meld （面子）: a combination of three/four tiles to be put to the corner
        // Gong-Zi (槓子): a meld that consists of four same tiles

        // Seon-Zi (順子): a meld that consists of three consecutive ranked tiles of a same suit (Only possible with numeric tiles)
        // Hak-Zi (刻子): a meld that consists of three same tiles

        // Am-Gong-Zi (暗槓子): a gong-zi made of four tiles drawn
        // Gaa-Gong-Zi (加槓子): a gong-zi made of a three-tile meld already at the corner and the tile just drawn
        // Ming-Gong-Zi (明槓子): a gong-zi made of three tiles drawn and a tile just discarded by others

        // Am-Gong-Zi Variant 1: an Am-Gong-Zi that involves the tile just drawn
        // Am-Gong-Zi Variant 2: an Am-Gong-Zi that consists of only tiles inside the hot-bar

        // Scenario 1 - A tile has just drawn from the deck. Melds either be the ones that involve the drawn tile or an am-gong-zi that can previously be made but ignored.
        // Scenario 2 - A tile has just been discarded by others. Melds must involve the discarded tile.
        // Melds applicable to scenario 1 - Gaa-Gong-Zi, Am-Gong-Zi (both variants)
        // Melds applicable to scenario 2 - Seon-Zi, Hak-Zi, Ming-Gong-Zi

        player.wall.properlySort(); //TODO is a sort necessary here?
        const availMelds: Meld[] = [];

        if (extraTileFrom === player) {
            // Scenario 1, find any available Gaa-Gong-Zi, Am-Gong-Zi (both variants)

            // 2.1) Find Am-Gong-Zi Variant 1
            if (player.wall.has([extraTile, extraTile, extraTile]))
                availMelds.push(new Meld(MeldType.AmGong, player.seatingId!, [extraTile, extraTile, extraTile, extraTile]));

            // 2.2) Find Gaa-Gong-Zi
            player.melds.forEach(m => {
                if (m.isPung() && m.first().is(extraTile))
                    availMelds.push(new Meld(MeldType.GaaGong, player.seatingId!, [extraTile, extraTile, extraTile, extraTile]));
            });

            // 2.2) Find Am-Gong-Zi Variant 2
            player.wall.distinct()
                .filter(t => !extraTile.is(t))
                .forEach(t => {
                    if (player.wall.has([t, t, t, t]))
                        availMelds.push(new Meld(MeldType.AmGong, player.seatingId!, [t, t, t, t]));
                });
        } else {
            // Scenario 2, find any available Seon-Zi, Hak-Zi, and Ming-Gong-Zi.

            // 2.1) Find Seon-Zi
            if (extraTileFrom === this.soengGaaOf(player) && extraTile.isNumeric()) {
                // The meld should involve the extra tile.
                // It has to be coded this way. It is probably O(3mn) but I just can't think of anything better yet not ugly.
                [
                    [extraTile, extraTile.add(1), extraTile.add(2)],
                    [extraTile.add(-1), extraTile, extraTile.add(1)],
                    [extraTile.add(-2), extraTile.add(-1), extraTile]
                ].forEach(possibleCombination => {
                    if ([...player.wall, extraTile].properlySorted().has(possibleCombination))
                        availMelds.push(new Meld(MeldType.MingSoeng, extraTileFrom.seatingId!, possibleCombination));
                });
            }
            // 2.2) Find Hak-Zi
            if (player.wall.has([extraTile, extraTile]))
                availMelds.push(new Meld(MeldType.MingPung, extraTileFrom.seatingId!, [extraTile, extraTile, extraTile]));

            // 2.3) Find Ming-Gong-Zi
            if (player.wall.has([extraTile, extraTile, extraTile]))
                availMelds.push(new Meld(MeldType.MingGong, extraTileFrom.seatingId!, [extraTile, extraTile, extraTile, extraTile]));
        }
        return availMelds;
    }

    //TODO anti-cheat should be conducted within the human class
    onMerge(player: Player, selectedMeld: Meld) {
        // 1) Insert the extra tile into player's hot bar.
        if (!selectedMeld.isSeize()) {
            // Scenario 1 - A tile has just drawn from the deck.
            // The extra tile is the tile drawn. Move it to the hot bar.
            const curDrewTile = player.drew;
            console.assert(curDrewTile);
            player.drew = null;
            player.wall.push(curDrewTile!);
        } else {
            // Scenario 2 - A tile has just been discarded by others.
            // The extra tile is at the tabletop. Move it to the hot bar.
            const discardedTile = this.players[this.lastPlayerIdx].discards.pop();
            this.discards.pop();
            player.wall.push(discardedTile!);
        }

        // 2) Remove all tiles of the meld from the player's hot bar.
        player.wall.remove(selectedMeld.tiles);

        // 3) Add the meld into player's corner
        if (selectedMeld.meldType !== MeldType.GaaGong) {
            player.melds.push(selectedMeld);
        } else {
            // 3.1) If meld is not Gaa-Gong, add meld directly to corner
            player.melds
                .find(c => c.meldType === MeldType.MingPung && c.tiles[0].is(selectedMeld.tiles[0]))
                ?.gaaGong();
        }

        // 4) Broadcast event
        this.onGameEvent(new PlayerMergeEvent(player.seatingId!, selectedMeld));
    }

    /**
     * Finds all hands based on the player's inventory and the extra tile.
     *
     * @param player The player to check against.
     * @param extraTile The extra tile, either the tile that have just drawn, or the tile that has been just discarded.
     *
     * @return If the player does not satisfy the preliminary requirement (Standard Combination, 花糊 or 十三么) or if
     * farn is lower than 3, an empty array will be returned.
     * Otherwise, a hand contains 1 base hand and >0 bonus hands will be returned.
     */
    getAvailHands(player: Player, extraTile: Tile): Hand[] {
        // 1) Identify sets and pairs for a standardized combination (4 sets 1 pair), and create a condition object for feeding into hand validators.
        const condition = new Condition(this, player, extraTile);

        // 2) Check if the condition satisfies the preliminary requirement of be able to sik.
        // For Hong Kong Mahjong, There are 3 cases - Standard Combination, 花糊 or 十三么.
        if (!this.canSik(condition))
            return []; //TODO return null instead

        // 3) Add satisfied bonus hands and see if it is in conflict with the primary hand
        const hands: Hand[] = [];
        const allConflicts = new Set<string>();
        for (const h of this.hands()) {
            if (!h.isSatisfied(condition))
                continue;
            if (allConflicts.has(h.name))
                continue;
            hands.push(h);
            h.conflictWith.forEach(o => allConflicts.add(o));
        }

        // 4) Check if faan is sufficient
        const totalFaan = hands.reduce<number>((n, h) => h.points + n, 0);
        if (totalFaan < 3)
            return []; //TODO can still return hands if faan is not sufficient

        // 5) Return a list of hands
        return hands;
    }

    onSik(player: Player, extraTile: Tile, extraTileFrom: Player, hands: Hand[]) {
        const scoreFromPoints: number[] = [1, 2, 4, 8, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384];

        // 1) Calculate faan and convert to points
        const faan = Math.min(13, hands.reduce((n: number, h: Hand) => n + h.points, 0));
        const pts = scoreFromPoints[faan];

        // 2) Calculate and apply the score difference of each player
        const scoreDiffs: number[] = this.players.map(p => {
            if (player !== extraTileFrom) {
                // Zi-Mo, the player eats due to the tile that he/she have just drawn.
                if (player === p)
                    return pts;
                if (extraTileFrom === p)
                    return -pts;
                return 0;
            } else {
                // Others Ceot-Cung, the player eats due to the tile that others have just discarded.
                if (player === p)
                    return pts * 1.5;
                return -pts * 1.5 / 3;
            }
        });
        this.scores = this.scores.map((s: number, pid: number) => s + scoreDiffs[pid]);

        // 3) Broadcast Event
        this.onGameEvent(
            new GukEndEvent(
                false,
                this.scores,
                scoreDiffs,
                [
                    {
                        pid: player.seatingId!,
                        extraTileFrom: extraTileFrom.seatingId!,
                        hands,
                        faan,
                    }
                ]
            )
        );
    }

    onDraw() {
        this.onGameEvent(
            new GukEndEvent(
                true,
                this.scores,
                [0, 0, 0, 0],
                []
            )
        );
    }

    abstract canSik(c: Condition): boolean;

    abstract hands(): Hand[];

    /**
     * Get the player before this player in a cycle of a game
     */
    soengGaaOf(player: Player): Player {
        // Same seatingId assumption rationale
        return this.players[(player.seatingId! - 1) % this.players.length];
    }

    /**
     * Get the player after this player in a cycle of a game
     */
    haaGaaOf(player: Player): Player {
        // Same seatingId assumption rationale
        return this.players[(player.seatingId! + 1) % this.players.length];
    }

}
