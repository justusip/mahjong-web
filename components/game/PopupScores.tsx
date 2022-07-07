import React from "react";
import Tile from "../../game/mechanics/Tile";

export interface StateScreenEndGuk {
    shown: boolean,
    drew: boolean,
    activeBtn: number,

    pid: number;
    playerNames: string[],
    scores: number[],
    scoreDiffs: number[],

    sikPid: number,
    handsName: string[],
    handsPoints: number[],
    totalPoints: number

    tiles: Tile[],
    tileLast: Tile
    flowers: Tile[],
    cornersFlatted: Tile[],

    onCompleted: () => void,
}

export default class PopupScores extends React.Component<{}, StateScreenEndGuk> {
    constructor(props: any) {
        super(props);
        this.state = {
            shown: false,
            drew: false,
            activeBtn: null,

            pid: 0,
            playerNames: [],
            scores: [],
            scoreDiffs: [],

            sikPid: 0,
            handsName: [],
            handsPoints: [],
            totalPoints: 0,

            tiles: [],
            tileLast: null,
            flowers: [],
            cornersFlatted: [],

            onCompleted: null
        };
        // this.state = {
        //     shown: true,
        //     activeBtn: null,
        //
        //     playerNames: [],
        //     scores: [],
        //     scoreDiffs: [],
        //
        //     sikPid: 0,
        //     handsName: [],
        //     handsPoints: [],
        //     totalPoints: 0,
        //
        //     tiles: [],
        //     tileLast: null,
        //     flowers: [],
        //     cornersFlatted: [],
        //
        //     onCompleted: null
        // };
    }

    async animateScores(toScores: number[]): Promise<void> {
        const fromScores = [...this.state.scores];
        const startTime = performance.now();
        while (true) {
            const timeElapsed = performance.now() - startTime;
            if (timeElapsed >= 1000)
                break;
            this.setState({
                scores: this.state.scores.map((_, j: number) =>
                    Math.ceil(fromScores[j] + ((toScores[j] - fromScores[j]) * timeElapsed / 1000)))
            });
            await new Promise(r => setTimeout(r, 10));
        }
        this.setState({scores: toScores});
    }

    toRelative<T>(absoluteList: T[]): T[] {
        const relativeList = [...Array(absoluteList.length)];
        for (let pid = 0; pid < absoluteList.length; pid++)
            relativeList[pid] = absoluteList[(this.state.pid + pid) % 4];
        return relativeList;
    }

    render(): React.ReactNode {
        const playerNames = this.toRelative(this.state.playerNames);
        const scores = this.toRelative(this.state.scores);
        const scoreDiffs = this.toRelative(this.state.scoreDiffs);
        return this.state.shown && <div className="overlay">
            <div className="popup">
                <div className="popup-header">
                    <div className="header">{this.state.drew ? "流局" : "食糊"}</div>
                    <div className="subheader">
                        {
                            this.state.drew ?
                                `下局冧莊(─‿‿─)` :
                                `${this.state.playerNames[this.state.sikPid]}食糊。番數合共${this.state.totalPoints}番。`
                        }

                    </div>
                </div>
                <div className="popup-content-horizontal">
                    {
                        !this.state.drew && <div id="game-scores-left">
                            <div className="popup-sides-subheader">番數盤點</div>
                            {
                                this.state.handsName.map((n: string, i: number) =>
                                    <div key={i}
                                         className="game-scores-receipt-item">
                                        <div className="game-scores-receipt-item-left">{n}</div>
                                        <div className="game-scores-receipt-item-right">{this.state.handsPoints[i]}番</div>
                                    </div>
                                )
                            }
                            <div id="game-scores-receipt-total">
                                共{this.state.totalPoints}番
                            </div>
                        </div>
                    }
                    <div id="game-scores-right">
                        <div className="popup-sides-subheader">大家嘅分數</div>
                        <div id="game-scores-table">
                            {
                                playerNames.map((name: string, i: number) =>
                                    <div
                                        key={i}
                                        className="game-scores-score" style={{
                                        transform: [
                                            "translate(0, 80px)",
                                            "translate(80px, 0)",
                                            "translate(0, -80px)",
                                            "translate(-80px, 0)"
                                        ][i]
                                    }}>
                                        <div className="game-scores-score-playername">
                                            {name}
                                        </div>
                                        <div className="game-scores-score-val"
                                             style={scores[i] !== 0 ? {"color": scores[i] > 0 ? "seagreen" : "indianred"} : {}}>
                                            {scores[i]}
                                        </div>
                                        <div className="game-scores-score-diff">
                                            {(scoreDiffs[i] >= 0 ? "+" : "") + scoreDiffs[i]}
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="popup-footer">
                    {
                        !this.state.drew && <span id="popup-tiles-display">
                        {
                            this.state.tiles.map((t: Tile, i: number) =>
                                <img key={i}
                                     src={`img/tiles/${t.type}_${t.num}.png`}/>
                            )
                        }
                            <span>+</span>
                            {
                                this.state.tileLast != null &&
                                <img key={-1}
                                     src={`img/tiles/${this.state.tileLast.type}_${this.state.tileLast.num}.png`}/>
                            }
                            <span style={{transform: "translateY(12px)"}}>└</span>
                            {
                                [
                                    ...this.state.cornersFlatted,
                                    ...this.state.flowers
                                ].map((t: Tile, i: number) =>
                                    <img key={i}
                                         src={`img/tiles/${t.type}_${t.num}.png`}/>
                                )
                            }
                        </span>
                    }
                    <button
                        className={[
                            "tile-btn",
                            this.state.activeBtn === 0 ? "active" : ""
                        ].join(" ")}
                        onMouseDown={_ => this.setState({activeBtn: 0})}
                        onMouseLeave={_ => this.setState({activeBtn: null})}
                        onClick={_ => this.state.onCompleted()}>
                        下一局
                    </button>
                </div>
            </div>
        </div>;
    }
}
