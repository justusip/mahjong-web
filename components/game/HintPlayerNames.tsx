import React from "react";
import {toRelative} from "../../game/Utils";

export default class HintPlayerNames extends React.Component<{}, {
    pid: number,
    playerNames: string[],
    posX: number[],
    posY: number[]
}> {

    constructor(props: any) {
        super(props);
        this.state = {
            pid: 0,
            playerNames: [],
            posX: [],
            posY: []
        };
    }

    render(): React.ReactNode {
        return <div className={this.state.posX.length > 0 ? "shown" : "hidden"} id="game-names-container">
            {
                toRelative(this.state.pid, this.state.playerNames).map((n: string, i: number) =>
                    <div key={i}
                         className="game-names-label"
                         style={{left: this.state.posX[i], top: this.state.posY[i]}}>
                        {n}
                    </div>
                )
            }
        </div>;
    }
}
