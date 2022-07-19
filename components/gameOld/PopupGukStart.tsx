import React from "react";
import Tile from "../../game/mechanics/Tile";
import {CSSTransition} from "react-transition-group";

export interface StateScreenEndGuk {
    curState: number
    fung: number,
    guk: number,
    remaining: number
}

export default class PopupGukStart extends React.Component<{}, StateScreenEndGuk> {
    constructor(props: any) {
        super(props);
        this.state = {
            curState: 0,
            fung: 0,
            guk: 0,
            remaining: 0
        };
    }

    render(): React.ReactNode {
        return <div className="game-general">
            <div className={[
                "overlay",
                this.state.curState === 1 ? "shown" : "hidden"
            ].join(" ")}>
                <div className={[
                    "popup-guk",
                    this.state.curState === 1 ? "enlarged" : "minimized"
                ].join(" ")}>
                    {"東南西北"[this.state.fung]}風{"東南西北"[this.state.guk]}局
                </div>
            </div>
            {
                <CSSTransition in={this.state.curState === 2} timeout={0} classNames={"gameOld-general-info"}>
                    <div className="game-general-info">
                        <div className="game-general-guk">{"東南西北"[this.state.fung]}風{"東南西北"[this.state.guk]}局</div>
                        <div className="game-general-remaining">{`x${this.state.remaining}`}</div>
                    </div>
                </CSSTransition>
            }
        </div>;
    }
}
