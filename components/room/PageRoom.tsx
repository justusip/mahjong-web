import React from "react";
import Game from "../../game/Game";
import {CSSTransition} from "react-transition-group";

interface StatePageRoom {
    roomCode: string,

    pid: number,
    playerNames: string[],
    ready: boolean[],

    onAddBot: () => void,
    onRemoveBot: (idx: number) => void,
    onExit: () => void,
    onReady: (ready: boolean) => void
    onStart: () => void
}

export default class PageRoom extends React.Component<any, StatePageRoom> {

    constructor(props: any) {
        super(props);
        this.state = {
            roomCode: "-",

            pid: 0,
            playerNames: [],
            ready: [],

            onAddBot: null,
            onRemoveBot: null,
            onExit: null,
            onReady: null,
            onStart: null
        };
    }

    componentDidMount() {
        Game.ins.onRoomMount(this);
    }

    render(): React.ReactNode {
        return <div className="body-room">
            <div className="popup" id="splash-login-panel">
                <div className="popup-header">
                    <div className="header">私人場</div>
                    <div className="subheader">玩家可以透過房號入房；有需要都可以加入電腦玩家。</div>
                </div>
                <div className="popup-content-horizontal">
                    {
                        [...Array(4)].map((_, i) =>
                            i < (this.state.playerNames.length) ?
                                <div key={i} className="room-grid room-grid-occupied">
                                    <div className="room-grid-name">{this.state.playerNames[i]}</div>
                                    {
                                        i === 0 ?
                                            <div className="room-grid-label">
                                                房主
                                            </div> :
                                            (
                                                i < this.state.ready.length ?
                                                    <div className="room-grid-label">
                                                        <input type="checkbox"
                                                               checked={this.state.ready[i]}
                                                               disabled={true}/>
                                                        準備好
                                                    </div> :
                                                    <div className="room-grid-label">
                                                        機械人
                                                        <img className="room-grid-remove"
                                                             src="/img/icons/remove.svg"
                                                             onClick={() => this.state.onRemoveBot(i - this.state.ready.length)}/>
                                                    </div>
                                            )
                                    }
                                </div>
                                :
                                <div key={i} className="room-grid room-grid-empty">
                                    {
                                        this.state.playerNames.length === i &&
                                        <div className="room-grid-add" onClick={this.state.onAddBot}>
                                            <img className="room-grid-icon" src="/img/icons/add.svg"/>
                                            <div className="room-grid-label">加入電腦玩家</div>
                                        </div>
                                    }
                                </div>
                        )
                    }
                </div>
                <div className="popup-footer">
                    <div id="room-code-desc">房間編號</div>
                    <input className="tile-input" id="room-code" value={this.state.roomCode} disabled/>
                    <button className="tile-btn"
                            onClick={_ => this.props.onExit()}>
                        出返去
                    </button>
                    <button className="tile-btn"
                            id="room-btn-ready"
                            onClick={_ => {
                                this.state.pid === 0 ?
                                    this.state.onStart() :
                                    this.state.onReady(!this.state.ready[this.state.pid]);
                            }}
                            disabled={
                                this.state.pid === 0 &&
                                (this.state.playerNames.length !== 4 ||
                                    !this.state.ready.slice(1).every(r => r))
                            }>
                        {this.state.pid === 0 ? "開始" : (!this.state.ready[this.state.pid] ? "準備好" : "取消準備")}
                    </button>
                </div>
            </div>
        </div>;
    }
}
