import Overlay from "../pieces/Overlay";
import {ms} from "../../utils/Delay";
import TileDialogue from "../generics/TileDialogue";
import TileTextbox from "../generics/TileTextbox";
import TileButton from "../generics/TileButton";
import React, {useState} from "react";
import OverlayDialogue from "../pieces/OverlayDialogue";

export default function FriendList(props: {
    shown: boolean,
    setShown: (shown: boolean) => void
}) {
    return <OverlayDialogue shown={props.shown}
                            transition={"magnify"}
                            onClick={() => props.setShown(false)}
                            centered={true}

                            header={"設定"}>
        <div className={"h-16"}>TBA</div>
    </OverlayDialogue>;
}
