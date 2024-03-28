import Condition from "./Condition";

/**
 * Every variation of Mahjong Game contains a predefined list of Hands (Winning Combinations),
 * and the current player's combination will be checked with each Hand's isSatisfied function.
 * If the combination matches the Hand's required specification, the Hand's points will be added to total points.
 */
export default class Hand {
    name: string;
    points: number;
    isSatisfied: (condition: Condition) => boolean;
    conflictWith: string[];

    constructor(
        name: string,
        points: number,
        isSatisfied: (condition: Condition) => boolean,
        conflictWith: string[] = [],
    ) {
        this.name = name;
        this.points = points;
        this.isSatisfied = isSatisfied;
        this.conflictWith = conflictWith;
    }

    toString() {
        return this.name;
    }
}
