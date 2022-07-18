"use strict";

export default class Tile {
    suit: number;
    rank: number;

    constructor(suit: number, rank: number) {
        // if (isNaN(suit) || suit < 0 || suit > 4)
        //     throw new Error(`InvalidTileRangeException: Requested suit ${suit} rank ${rank}`);
        //
        // if (isNaN(rank) || rank < 0 || rank > 8)
        //     throw new Error(`InvalidTileRangeException: Requested suit ${suit} rank ${rank}`);

        this.suit = suit;
        this.rank = rank;
    }

    serialize(): number {
        return this.suit * 10 + this.rank;
    }

    static deserialize(obj: number): Tile {
        return new Tile(Math.floor(obj / 10), obj % 10);
    }

    static random(): Tile {
        return new Tile(Math.floor(Math.random() * 3), Math.floor(Math.random() * 9));
    }

    static parse(string: string): Tile {
        const suit: { [key: string]: number } = {m: 0, t: 1, s: 2, f: 3, w: 4};
        return new Tile(suit[string.toLowerCase()[0]], parseInt(string[1]) - 1);
    }

    static parseList(string: string): Tile[] {
        const str = string.trim().replace(/ /g, "");
        if (str.length % 2 != 0)
            throw new Error("InvalidTileFormat");
        let segments = [];
        for (let i = 0; i < str.length; i += 2) {
            const t = this.parse(str.substring(i, i + 2));
            segments.push(t);
        }
        return segments;
    }

    compareTo(b: Tile): number {
        return this.suit === b.suit ? this.rank - b.rank : this.suit - b.suit;
    }

    equalsTo(e: Tile): boolean {
        if (e == null)
            return false;
        return this.suit === e.suit && this.rank === e.rank;
    }

    toString(): string {
        return [
            ["一萬", "二萬", "三萬", "四萬", "五萬", "六萬", "七萬", "八萬", "九萬"],
            ["一筒", "二筒", "三筒", "四筒", "五筒", "六筒", "七筒", "八筒", "九筒"],
            ["一索", "二索", "三索", "四索", "五索", "六索", "七索", "八索", "九索"],
            [" 東 ", " 南 ", " 西 ", " 北 ", " 中 ", " 發 ", " 白 "],
            [" 春 ", " 夏 ", " 秋 ", " 冬 ", " 梅 ", " 蘭 ", " 菊 ", " 竹 "]
        ][this.suit][this.rank];
    }

    add(offset: number): Tile {
        return new Tile(this.suit, this.rank + offset);
    }

    isMaan(): boolean {
        return this.suit == 0;
    }

    isSok(): boolean {
        return this.suit == 1;
    }

    isTung(): boolean {
        return this.suit == 2;
    }

    isFaan(): boolean {
        return this.suit == 3;
    }

    isFlower(): boolean {
        return this.suit == 4;
    }

    isNumeric(): boolean {
        return this.isMaan() || this.isSok() || this.isTung();
    }

    isCingJiu(): boolean {
        return this.isNumeric() && (this.rank == 0 || this.rank == 8);
    }

    isFaaJiu(): boolean {
        return this.isCingJiu() || this.isFaan();
    }

    isSeiHei(): boolean {
        return this.isFaan() && this.rank >= 0 && this.rank <= 3;
    }

    isSaamJyun(): boolean {
        return this.isFaan() && this.rank >= 4 && this.rank <= 6;
    }
}
