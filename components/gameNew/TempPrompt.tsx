import Tile from "../../game/mechanics/Tile";
import Meld from "../../game/mechanics/Meld";
import React from "react";

export default function TempPrompt(props: {
    prompt: {
        availMelds: Meld[]
        availSik: boolean
    } | null,
    onDecide: (decision: number) => void
}) {
    if (!props.prompt)
        return <></>;
    return <div className={"p-4 bg-white absolute top-0 mx-auto"}>
        <button onClick={() => props.onDecide(-2)}>唔理</button>
        {
            props.prompt.availSik &&
            <button onClick={() => props.onDecide(-2)}>食</button>
        }
        {
            props.prompt.availMelds &&
            props.prompt.availMelds.map(m =>
                <button>
                    {
                        m.tiles.map((t, i) =>
                            <img key={i} width={16} src={`img/tiles/${t.suit}_${t.rank}.png`}/>)
                    }
                </button>
            )
        }
    </div>;
}
