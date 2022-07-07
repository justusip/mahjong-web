import React from "react";
import io from "socket.io-client";

import Game from "../../game/Game";
import PopupGukStart from "./PopupGukStart";
import PromptMerge from "./PromptMerge";
import PromptEat from "./PromptEat";
import PopupScores from "./PopupScores";
import PopupRank from "./PopupRank";
import Room from "../../game/graphics/Room";
import HintPlayerNames from "./HintPlayerNames";
import anime from "animejs";
import {CSSTransition} from "react-transition-group";

export default class PageGame extends React.Component<any, any> {

    canvas: HTMLCanvasElement;

    room: Room;

    hintPlayerNames: HintPlayerNames;
    popupGukStart: PopupGukStart;
    promptMerge: PromptMerge;
    promptEat: PromptEat;
    screenGukEnd: PopupScores;
    screenGameEnd: PopupRank;

    constructor(props: any) {
        super(props);
        this.state = {
            loading: true
        };
    }

    async componentDidMount() {
        await new Promise<void>(r => setTimeout(r, 500));
        this.screenGameEnd.setState({
            onCompleted: this.props.onExit
        });

        this.room = new Room();
        await this.room.onStart(this.canvas, Game.ins.selfPid);

        Game.ins.load(this, this.room);
        this.setState({loading: false});

        anime({
            targets: this.room.camera,
            fov: [80, 60],
            duration: 2000,
            easing: "easeInOutCubic",
            update: () => {
                this.room.camera.updateProjectionMatrix();
            }
        });
        anime({
            targets: this.room.camera.rotation,
            x: [-60 / 180 * Math.PI, -Math.PI * .35],
            duration: 2000,
            easing: "easeInOutCubic"
        });
        anime({
            targets: this.room.camera.position,
            z: [.4, .3],
            duration: 2000,
            easing: "easeInOutCubic"
        });
        await new Promise<void>(r => setTimeout(r, 2000));
        Game.ins.ready();
    }

    componentWillUnmount() {
        Game.ins.disconnect();
        this.room.stop();
    }

    render(): React.ReactNode {
        return [
            <canvas ref={r => this.canvas = r} id="canvas"/>,
            <div id="ui">
                <HintPlayerNames ref={r => this.hintPlayerNames = r}/>
                <PopupGukStart ref={r => this.popupGukStart = r}/>
                <PromptMerge ref={r => this.promptMerge = r}/>
                <PromptEat ref={r => this.promptEat = r}/>
                <PopupScores ref={r => this.screenGukEnd = r}/>
                <PopupRank ref={r => this.screenGameEnd = r}/>
            </div>,
            <CSSTransition in={!this.state.loading} timeout={1000} classNames="void">
                <div className="void"/>
            </CSSTransition>
        ];
    }
}
