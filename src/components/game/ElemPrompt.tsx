import React from "react";

import IntrinsicButton from "../generic/IntrinsicButton";
import Meld from "@/types/Meld";

export default function ElemPrompt(props: {
    prompt: {
        availMelds: Meld[]
        availSik: boolean
    } | null,
    onDecide: (decision: number) => void
}) {
    if (!props.prompt)
        return <></>;
    return <div className="absolute right-0 bottom-[14%] h-[12%] flex place-items-center">
        <IntrinsicButton onClick={() => props.onDecide(-2)}>唔理</IntrinsicButton>
        {
            props.prompt.availSik &&
            <IntrinsicButton onClick={() => props.onDecide(-2)}>食</IntrinsicButton>
        }
        {
            props.prompt.availMelds &&
            props.prompt.availMelds.map((m, i) =>
                <IntrinsicButton key={i} className="flex place-items-center" onClick={() => props.onDecide(i)}>
                    {
                        m.tiles.map((t, i) =>
                            <img key={i} width={16} src={`img/tiles/tile_${t.suit}_${t.rank}.png`}/>)
                    }
                </IntrinsicButton>
            )
        }
    </div>;
}
