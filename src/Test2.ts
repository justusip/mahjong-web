import Event from "@/events/Event";
import PlayerDrewEvent from "@/events/PlayerDrewEvent";
import Tile from "@/types/Tile";

const e = new PlayerDrewEvent(0, Tile.parse("m1"));
const serialized = e.serialize();
console.log(serialized);
const deserialized = Event.deserialize(serialized);
console.log(deserialized);