import Meld from "../types/Meld";
import Tile from "../types/Tile";

declare global {
    interface Array<T> {
        isEmpty(): boolean;

        first(): T | null;

        occurrence(o: T): number;

        count(predicate: (o: T) => boolean): number;

        distinct(): Array<T>;

        distinctlyOne<S>(predicate: (o: T) => S): boolean;

        random(): T;

        shuffle(): void;

        has(o: T[]): boolean;

        matches(o: T[]): boolean;

        remove(o: T[]): boolean;

        properlySort(): void;

        properlySorted(): T[];

        serialize(): unknown[];
    }
}

export {};

function equals<T>(a: T, b: T): boolean {
    if (a instanceof Tile || a instanceof Meld)
        return (a as unknown as { is: (a: T | null) => boolean } | never).is(b);
    return a === b;
}

Array.prototype.isEmpty = function (): boolean {
    return this.length === 0;
};

Array.prototype.first = function <T>(): T | null {
    if (this.length === 0)
        return null;
    return this[0];
};

Array.prototype.occurrence = function <T>(o: T): number {
    return this.count(p => equals(o, p));
};

Array.prototype.count = function <T>(predicate: (o: T) => boolean): number {
    return this.reduce<number>((n, p) => n + (predicate(p) ? 1 : 0), 0);
};

Array.prototype.distinct = function <T>(): T[] {
    return this.filter((a: T, i: number, self) => self.findIndex(b => equals(a, b)) === i);
};

Array.prototype.distinctlyOne = function <T, S>(predicate: (o: T) => S): boolean {
    // TODO bug
    // When you call TileList.distinctlyOne(), this Array.prototype.distinctlyOne function will be called.
    // However, in the below line, when I call .distinct(), the .distinct() method of TileList will be called,
    // instead of Array.prototype.distinct. I am not sure why.
    // It should be this.map<S>(predicate).distinct().length === 1

    return [...this.map<S>(predicate)].distinct().length === 1;
};

Array.prototype.random = function <T>(): T {
    return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.shuffle = function (): void {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
};

Array.prototype.has = function <T>(o: Array<T>): boolean {
    const tray = [...this];
    for (const m of o) {
        const k = tray.find(n => equals(m, n));
        if (!k)
            return false;
        tray.splice(tray.indexOf(k), 1);
    }
    return true;
};

Array.prototype.matches = function <T>(o: Array<T>): boolean {
    const tray = [...this];
    for (const m of o) {
        const k = tray.find(n => equals(m, n));
        if (!k)
            return false;
        tray.splice(tray.indexOf(k), 1);
    }
    return tray.length === 0;
};

Array.prototype.remove = function <T>(o: Array<T>): boolean {
    if (!this.has(o))
        return false;
    for (const m of o) {
        const k = this.find(n => equals(m, n));
        this.splice(this.indexOf(k), 1);
    }
    return true;
};

Array.prototype.properlySort = function (): void {
    this.sort((a, b) => a.compareTo(b));
};

Array.prototype.properlySorted = function <T>(): Array<T> {
    const l = [...this];
    l.properlySort();
    return l;
};

Array.prototype.serialize = function (): unknown[] {
    return this.map(o => o.serialize());
};
