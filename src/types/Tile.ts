export default class Tile {
    suit: number;
    rank: number;
    variant: number;

    constructor(suit: number, rank: number, variant: number) {
        // if (isNaN(suit) || suit < 0 || suit > 4)
        //     throw new Error(`InvalidTileRangeException: Requested suit ${suit} rank ${rank}`);
        //
        // if (isNaN(rank) || rank < 0 || rank > 8)
        //     throw new Error(`InvalidTileRangeException: Requested suit ${suit} rank ${rank}`);

        this.suit = suit;
        this.rank = rank;
        this.variant = variant;
    }

    serialize(): number {
        return this.suit * 100 + this.rank * 10 + this.variant;
    }

    static deserialize(obj: number): Tile {
        return new Tile(Math.floor(obj / 100) % 10, Math.floor(obj / 10) % 10, obj % 10);
    }

    static random(): Tile {
        return new Tile(
            Math.floor(Math.random() * 3),
            Math.floor(Math.random() * 9),
            Math.floor(Math.random() * 4)
        );
    }

    static parse(string: string): Tile {
        const suit: { [key: string]: number } = {a: 0, b: 1, c: 2, d: 3, e: 4, m: 0, t: 1, s: 2, f: 3, w: 4};
        return new Tile(suit[string.toLowerCase()[0]], parseInt(string[1]) - 1, 0);
    }

    static parseList(string: string): Tile[] {
        const str = string.trim().replace(/ /g, "");
        if (str.length % 2 != 0)
            throw new Error("InvalidTileFormat");
        const segments = [];
        for (let i = 0; i < str.length; i += 2) {
            const t = this.parse(str.substring(i, i + 2));
            segments.push(t);
        }
        return segments;
    }

    compareTo(b: Tile): number {
        return this.suit === b.suit ? this.rank - b.rank : this.suit - b.suit;
    }

    is(t: Tile | null): boolean {
        if (!t)
            return false;
        return this.suit === t.suit && this.rank === t.rank;
    }

    identicalAs(t: Tile | null): boolean {
        if (!t)
            return false;
        return this.suit === t.suit && this.rank === t.rank && this.variant === t.variant;
    }

    hasValue(suit: number, rank: number, id?: number) {
        if (this.suit === suit && this.rank === rank) {
            if (id) {
                return this.variant === id;
            } else {
                return true;
            }
        }
        return false;
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
        return new Tile(this.suit, this.rank + offset, this.variant);
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

    isJiuGau(): boolean {
        return this.isCingJiu() || this.isFaan();
    }

    isSeiHei(): boolean {
        return this.isFaan() && this.rank >= 0 && this.rank <= 3;
    }

    isSaamJyun(): boolean {
        return this.isFaan() && this.rank >= 4 && this.rank <= 6;
    }

    isGreen(): boolean {
        return (
            this.isNumeric() &&
            [2, 3, 4, 6, 8].includes(this.rank)
        ) || (
            this.isFaan() &&
            this.suit === 5
        );
    }

    isRedDora(): boolean {
        return (
            this.hasValue(0, 4, 3) ||
            this.hasValue(1, 4, 3) ||
            this.hasValue(2, 4, 3)
        );
    }
}
