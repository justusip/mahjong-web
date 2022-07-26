import React from "react";

import Tile from "../../types/Tile";

export default function ElemHotbar(props: {
    hotbar: Tile[],
    drew: Tile | null,
    onDiscard: (tile: Tile) => void
}) {
    return <div className="absolute bottom-0 left-[12%] h-[12%] flex gap-[2px]">
        {
            [...props.hotbar, null, props.drew].map((t, i) =>
                t ?
                    <img key={i} src={`img/tiles/tile_${t.suit}_${t.rank}.png`}
                         className="h-full"
                         onClick={() => props.onDiscard(t)}/> :
                    <img key={i} src="img/tiles/tile_3_7.png" className="h-full"/>
            )
        }
    </div>;
}
