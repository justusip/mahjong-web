import Meld from "@/types/Meld";
import Tile from "@/types/Tile";
import Game from "@/server/logic/Game";
import Decision from "../models/Decision";
import EventListener from "@/events/EventListener";
import GukStartEvent from "@/events/GukStartEvent";
import {v4} from "uuid";

export default abstract class Player extends EventListener {
    protected game: Game;

    readonly uuid: string;
    readonly name: string;

    /**
     * Player's fixed seating number, unchanged throughout the whole game.
     * It should be null when a player instance is first instantiated. After starting the game, the player's seat will
     * be determined, and the variable will be set to a number within 0-3. It will remain unchanged throughout the game.
     *
     *      [2]
     *     + - +
     * [3] |   | [1]
     *     + - +
     *      [0]
     * (Starting Zong of Fung 1 Guk 1)
     *
     * For virtual PID with respect to the game's fung, see fungPid().
     */
    seatingId: number | null = null;

    /**
     * Player's seating number with respect to game's fung.
     *
     *           [2] 2                        [2] 1
     *         + ----- +                    + ----- +
     *   [3] 3 |       | [1] 1   ->   [3] 2 |       | [1] 0
     *         + ----- +                    + ----- +
     *           [0] 0                        [0] 3
     *
     * 0 is always the zong of the guk.
     */
    wrtFungId: number | null = null;

    wall: Tile[];
    drew: Tile | null;
    melds: Meld[];
    flowers: Tile[];
    discards: Tile[];
    hasLichi: boolean;

    turn: number;
    turnSinceLichi: number;

    constructor(name: string, uuid?: string) {
        super();
        this.uuid = uuid || v4();
        this.name = name;
    }

    attachGameRef(game: Game, mySeatingId: number): void {
        this.game = game;
        this.seatingId = mySeatingId;
    }

    override onGukStart(e: GukStartEvent) {
        this.wrtFungId = (this.seatingId! - this.game.guk + 4) % 4;
    }

    /**
     * Check whether the player is this fung's ZongGaa（莊家）.
     */
    isZong(): boolean {
        return this.wrtFungId === 0;
    }

    /**
     * Check whether the player is this fung's HaanGaa（閒家）, i.e., not ZongGaa
     */
    isHaan(): boolean {
        return this.wrtFungId !== 0;
    }

    async decideReady(): Promise<void> {
        return;
    }

    abstract decideDiscard(): Promise<Tile>;

    abstract decidePrompt(availMelds: Meld[], availSik: boolean): Promise<Decision>;

}
