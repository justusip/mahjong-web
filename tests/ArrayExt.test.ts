import "@/utils/ArrayExt";

import Meld, {MeldType} from "@/types/Meld";
import Tile from "@/types/Tile";

test("Tile[].has() => true", () => {
    const t = Tile.parseList("a1 a1 a2 a3 a4 b1 b2 b3 b3 c4 c4 c4");
    expect(t.has(Tile.parseList("a1 a2 a3"))).toBe(true);
});
test("Tile[].has() => false", () => {
    const t = Tile.parseList("a1 a1 a2 a3 a4 b1 b2 b3 b3 c4 c4 c4");
    expect(t.has(Tile.parseList("a1 a1 a2 a3 a4 b2 b3 b3 c4 c4 c5"))).toBe(false);
});
test("Tile[].matches() => true", () => {
    const t = Tile.parseList("a1 a1 a2 a3 a4 b1 b2 b3 b3 c4 c4 c4");
    expect(t.matches(Tile.parseList("a1 a1 a2 a3 a4 b1 b2 b3 b3 c4 c4 c4"))).toBe(true);
});
test("Tile[].matches() => false", () => {
    const t = Tile.parseList("a1 a1 a2 a3 a4 b1 b2 b3 b3 c4 c4 c4");
    expect(t.matches(Tile.parseList("a1 a1 a2 a3 a4 b1 b2 b3 b7 c4 c4 c4"))).toBe(false);
});

test("Meld[].matches() => true", () => {
    const a = [
        new Meld(MeldType.AmPung, ...Tile.parseList("a1 a1 a1")),
        new Meld(MeldType.AmSoeng, ...Tile.parseList("b1 b2 b3")),
        new Meld(MeldType.AmSoeng, ...Tile.parseList("b4 b5 b6")),
        new Meld(MeldType.AmGong, ...Tile.parseList("a2 a2 a2 a2")),
    ];
    const b = [
        new Meld(MeldType.AmPung, ...Tile.parseList("a1 a1 a1")),
        new Meld(MeldType.AmSoeng, ...Tile.parseList("b1 b2 b3")),
        new Meld(MeldType.AmSoeng, ...Tile.parseList("b4 b5 b6")),
        new Meld(MeldType.AmGong, ...Tile.parseList("a2 a2 a2 a2")),
    ];
    expect(a.matches(b)).toBe(true);
});
test("Meld[].matches() => false #1", () => {
    const a = [
        new Meld(MeldType.AmPung, ...Tile.parseList("a1 a1 a1")),
        new Meld(MeldType.AmSoeng, ...Tile.parseList("b1 b2 b3")),
        new Meld(MeldType.AmSoeng, ...Tile.parseList("b4 b5 b6")),
        new Meld(MeldType.AmGong, ...Tile.parseList("a2 a2 a2 a2")),
    ];
    const b = [
        new Meld(MeldType.AmPung, ...Tile.parseList("a1 a1 a1")),
        new Meld(MeldType.AmSoeng, ...Tile.parseList("b1 b2 b3")),
        new Meld(MeldType.AmSoeng, ...Tile.parseList("b4 b5 b6")),
        new Meld(MeldType.MingGong, ...Tile.parseList("a2 a2 a2 a2")),
    ];
    expect(a.matches(b)).toBe(false);
});
test("Meld[].matches() => false #2", () => {
    const a = [
        new Meld(MeldType.AmPung, ...Tile.parseList("a1 a1 a1")),
        new Meld(MeldType.AmSoeng, ...Tile.parseList("b1 b2 b3")),
        new Meld(MeldType.AmSoeng, ...Tile.parseList("b4 b5 b6")),
        new Meld(MeldType.AmGong, ...Tile.parseList("a2 a2 a2 a2")),
    ];
    const b = [
        new Meld(MeldType.AmPung, ...Tile.parseList("a1 a1 a1")),
        new Meld(MeldType.AmSoeng, ...Tile.parseList("b2 b3 b4")),
        new Meld(MeldType.AmSoeng, ...Tile.parseList("b4 b5 b6")),
        new Meld(MeldType.AmGong, ...Tile.parseList("a2 a2 a2 a2")),
    ];
    expect(a.matches(b)).toBe(false);
});
test("Tile[].occurance()", () => {
    const t = Tile.parseList("a1 a1 a2 a3 a4 b1 b2 b3 b3 c4 c4 c4");
    expect(t.occurrence(Tile.parse("a3"))).toBe(1);
});
test("number[].occurance()", () => {
    const l = [0, 1, 2, 3, 4, 5, 5, 6, 6, 6, 7, 8,];
    expect(l.occurrence(5)).toBe(2);
});

test("Tile[].distinct()", () => {
    const t = Tile.parseList("a1 a2 a3 a4 a5 a5 a5 a6 a6 a7")
    expect(t.distinct().occurrence(Tile.parse("a5"))).toBe(1);
});
