import React from "react";
import Tile from "../../game/mechanics/Tile";
import Meld, {MeldType} from "../../game/mechanics/Meld";

export interface StatePromptMerge {
    shown: boolean,
    activeBtn: number,
    causeTile: Tile,
    selections: Meld[],
    onDecideMerge: (selIdx: number) => void
}

export default class PromptMerge extends React.Component<{}, StatePromptMerge> {
    constructor(props: any) {
        super(props);
        this.state = {
            shown: false,
            activeBtn: null,
            causeTile: null,
            selections: [],
            onDecideMerge: null
        };
    }

    render(): React.ReactNode {
        const cause = this.state.causeTile === null ? " ? " : this.state.causeTile.toString();
        return <div className={`prompt-merge ${this.state.shown ? "expanded" : "retracted"}`}>
            {
                this.state.selections.length === 0 || this.state.selections[0].isSeize() ?
                    <div className="prompt-desc">
                        啱啱有玩家出咗隻{cause}。<br/>
                        鳴唔鳴牌？
                    </div> :
                    <div className="prompt-desc">
                        啱啱你摸咗隻{cause}。<br/>
                        槓唔槓？
                    </div>
            }
            {
                this.state.selections.map((s: Meld, i: number) =>
                    <button key={i}
                            className={`tile-btn ${this.state.activeBtn === i ? "active" : ""}`}
                            onMouseDown={_ => this.setState({activeBtn: i})}
                            onMouseLeave={_ => this.setState({activeBtn: null})}
                            onClick={_ => this.state.onDecideMerge(i)}>
                        <div>
                            {
                                s.tiles.map((t: Tile, i: number) =>
                                    <img key={i}
                                         className="prompt-button-icon"
                                         src={`img/tiles/${t.type}_${t.num}.png`}/>
                                )
                            }
                        </div>
                        <div className="prompt-button-desc">
                            {
                                (s.type === MeldType.GaaGong || s.type === MeldType.MingGong) ?
                                    (
                                        s.type === MeldType.MingGong ?
                                            `大明槓` :
                                            `加槓`
                                    ) : (
                                        s.type === MeldType.AmGong ?
                                            `暗槓` :
                                            (
                                                s.type === MeldType.Pung ?
                                                    `碰` :
                                                    `連埋${s.tiles.filter(t => !t.equals(this.state.causeTile)).join("同")}上`
                                            )
                                    )
                            }
                        </div>
                    </button>
                )
            }
            <button className={`tile-btn ${this.state.activeBtn === -1 ? "active" : ""}`}
                    onMouseDown={_ => this.setState({activeBtn: -1})}
                    onMouseLeave={_ => this.setState({activeBtn: null})}
                    onClick={_ => this.state.onDecideMerge(-1)}>
                <img src="/img/icons/pass.svg"/>
                <div>唔理</div>
            </button>
        </div>;
    }
}
