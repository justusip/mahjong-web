import Tile from "@/types/Tile";

export default class Deck extends Array<Tile> {
    reset(withFlowers: boolean) {
        while (!this.isEmpty())
            this.pop();

        for (let suit = 0; suit < 3; suit++)
            for (let rank = 0; rank < 9; rank++)
                for (let variant = 0; variant < 4; variant++)
                    this.push(new Tile(suit, rank, variant));

        for (let rank = 0; rank < 7; rank++)
            for (let variant = 0; variant < 4; variant++)
                this.push(new Tile(3, rank, variant));

        if (withFlowers)
            for (let num = 0; num < 8; num++)
                this.push(new Tile(4, num, 0));
    }

    drawOne(): Tile | null {
        return this.pop() || null;
    }

    drawSome(num: number) {
        return this.splice(0, num);
    }


}
