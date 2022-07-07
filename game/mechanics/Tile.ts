export default class Tile {
    type: number;
    num: number;

    constructor(type: number, num: number) {
        if (isNaN(type) || type < 0 || type > 4)
            throw "InvalidTileRangeException";

        if (isNaN(num) || num < 0 || num > 8)
            throw "InvalidTileRangeException";

        this.type = type;
        this.num = num;
    }

    static deserialize(obj: any): Tile {
        return new Tile(obj["type"], obj["num"]);
    }

    static random() {
        return new Tile(Math.floor(Math.random() * 3), Math.floor(Math.random() * 9));
    }

    static parse(string: string) {
        return new Tile(string.toUpperCase()[0].charCodeAt(0) - 'A'.charCodeAt(0), parseInt(string[1]) - 1);
    }

    static parseList(string: string) {
        if (string.trim() === "")
            return [];
        return string.split(" ").map(o => this.parse(o));
    }

    serialize(): any {
        return {
            "type": this.type,
            "num": this.num
        };
    }

    compare(b: Tile) {
        return this.type === b.type ? this.num - b.num : this.type - b.type;
    }

    equals(e: Tile) {
        if (e == null)
            return false;
        return this.type === e.type && this.num === e.num;
    }

    toString() {
        return [
            ["一萬", "二萬", "三萬", "四萬", "五萬", "六萬", "七萬", "八萬", "九萬"],
            ["一筒", "二筒", "三筒", "四筒", "五筒", "六筒", "七筒", "八筒", "九筒"],
            ["一索", "二索", "三索", "四索", "五索", "六索", "七索", "八索", "九索"],
            [" 東 ", " 南 ", " 西 ", " 北 ", " 中 ", " 發 ", " 白 "],
            [" 春 ", " 夏 ", " 秋 ", " 冬 ", " 梅 ", " 蘭 ", " 菊 ", " 竹 "]
        ][this.type][this.num];
    }

    add(offset: number) {
        return new Tile(this.type, this.num + offset);
    }
}
