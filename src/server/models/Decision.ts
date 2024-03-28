import DecisionType from "./DecisionType";
import Meld from "@/types/Meld";

export default interface Decision {
    decision: DecisionType,
    selectedMeld?: Meld
}
