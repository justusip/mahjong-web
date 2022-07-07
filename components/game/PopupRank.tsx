import React from "react";
import Tile from "../../game/mechanics/Tile";

export interface StateScreenGameGuk {
    shown: boolean,
    activeBtn: number,
    playerNames: string[],
    scores: number[];
    onCompleted: () => void,
}

export default class PopupRank extends React.Component<{}, StateScreenGameGuk> {
    constructor(props: any) {
        super(props);
        this.state = {
            shown: false,
            activeBtn: null,
            playerNames: [],
            scores: [],
            onCompleted: null
        };
    }

    render(): React.ReactNode {
        const stats = this.state.playerNames.map((n, i) => {
            return {
                playerName: n,
                score: this.state.scores[i]
            };
        }).sort((a, b) => b.score - a.score);
        return this.state.shown && <div className="overlay">
            <div className="popup">
                <div className="popup-header">
                    <div className="header">局終</div>
                    <div className="subheader">恭喜{stats[0].playerName}攞最高分(≧▽≦)</div>
                </div>
                <div className="popup-content-vertical">
                    {
                        stats.map((o, i) =>
                            <div key={i}
                                 className="popup-end-rank">
                                <div className="popup-end-rank-number">{i + 1}</div>
                                <div className="popup-end-rank-right">
                                    <div className="popup-end-rank-name">{o.playerName}</div>
                                    <div className="popup-end-rank-score">{o.score}</div>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="popup-footer">
                    <button
                        className={[
                            "tile-btn",
                            this.state.activeBtn === 0 ? "active" : ""
                        ].join(" ")}
                        onMouseDown={_ => this.setState({activeBtn: 0})}
                        onMouseLeave={_ => this.setState({activeBtn: null})}
                        onClick={_ => this.state.onCompleted()}>
                        去返大堂
                    </button>
                </div>
            </div>
        </div>;
    }
}
