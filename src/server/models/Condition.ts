import "@/utils/ArrayExt";

import Meld, {MeldType} from "@/types/Meld";
import Tile from "@/types/Tile";
import Game from "@/server/logic/Game";
import Player from "../players/Player";

/**
 * When identifying winning hands of the player, the player's current state is captured into this object.
 * This condition object will be passed to defined Hands' isMatch function to determine whether the condition satisfies
 * the requirement of each hand. For each hand that the requirement is satisfied, points of the hand will be added
 * to the total points.
 */
export default class Condition {
    readonly game: Game;
    readonly player: Player;

    readonly hasLichi: boolean;
    readonly all: Tile[];

    readonly hotbar: Tile[];
    readonly extraTile: Tile;
    readonly cornerMelds: Meld[];
    readonly flowers: Tile[];

    /**
     * If the combination is a standard combination, isSC will be set the true, and
     * melds, eyes and hiddenMelds will be populated.
     */
    readonly isSC: boolean;
    readonly melds: Meld[] | null = null;
    readonly eyes: Tile[] | null = null;
    readonly hiddenMelds: Meld[] | null;


    constructor(game: Game, player: Player, extraTile: Tile) {
        this.game = game;
        this.player = player;

        this.hasLichi = player.hasLichi;
        this.all = [...player.melds.flatMap(m => m.tiles), ...player.wall, extraTile];
        this.hotbar = player.wall;
        this.extraTile = extraTile;
        this.cornerMelds = player.melds;
        this.flowers = player.flowers;

        const sc = Condition.identifyStandardCombination(player.wall, extraTile);
        this.isSC = !!sc;
        if (sc) {
            this.hiddenMelds = sc.sets;
            this.melds = [...this.cornerMelds, ...this.hiddenMelds];
            this.eyes = sc.eyes;
        }
    }

    /**
     * Identifies a standard combination (4/5 sets + 1 eyes) based on a player's hotbar + extra tiles.
     * It ***DOES NOT*** consider corner melds that have already been made (and corner flowers).
     *
     * @param hotbar The tiles that the player owns in front of him/her, namely the "hot bar" tiles.
     * @param extraTile The tile that has just been drawn/discarded by others.
     *
     * @return If the player possess a standard combination, sets and eyes constituting the combination will be returned.
     * Otherwise, it will return null.
     */
    static identifyStandardCombination(hotbar: Tile[], extraTile: Tile): { sets: Meld[], eyes: Tile[] } | null {
        const tiles = [...hotbar, extraTile];
        tiles.properlySort();

        // 1) Identify tiles that appeared twice or above. Maybe they are eyes of a standard combination.
        const probableEyes = tiles.distinct().filter(t => tiles.occurrence(t) >= 2);

        // 2) For each possible eyes, attempt to identify a standard combination with it as the eyes
        for (const eye of probableEyes) {
            const tray = [...tiles];
            tray.remove([eye, eye]);

            const sets: Meld[] = [];

            while (!tray.isEmpty()) {
                const cursor = tray.first()!; // If Tile[] is not empty, then Tile[].first() must not return null.

                if (tray.occurrence(cursor) === 3) {
                    sets.push(new Meld(MeldType.AmPung, -1, [cursor, cursor, cursor]));
                } else {
                    if (!cursor.isNumeric())
                        break;
                    if (cursor.rank >= 7)
                        break;
                    if (!tray.has([cursor, cursor.add(1), cursor.add(2)]))
                        break;
                    sets.push(new Meld(MeldType.AmSoeng, -1, [cursor, cursor.add(1), cursor.add(2)]));
                }
                tray.remove(sets[sets.length - 1].tiles);
            }
            // 3) If all the tiles in the tray have been used up, this combination is a standard combination
            if (tray.isEmpty())
                return {sets, eyes: [eye, eye]};
        }

        // 4) Return null if a standard combination is not identified
        return null;
    };

    /**
     * Check if the combination is a standard combination and has a PungZi of tile (suit, rank).
     *
     * @param suit
     * @param rank
     */
    hasPungziOf(suit: number, rank: number) {
        return this.isSC &&
            this.melds!.some(s => s.first().is(new Tile(suit, rank, 0)));
    }
}
