import React from "react";

export interface StatePromptEat {
    shown: boolean,
    activeBtn: number,
    onDecideEat: (eat: boolean) => void
}

export default class PromptEat extends React.Component<{}, StatePromptEat> {
    constructor(props: any) {
        super(props);
        this.state = {
            shown: false,
            activeBtn: null,
            onDecideEat: null
        };
    }

    render(): React.ReactNode {
        return <div className="game-eat">
            <button
                className={[
                    this.state.shown ? "enlarged shown" : "minimized hidden",
                    this.state.activeBtn === 0 ? "active" : ""
                ].join(" ")}
                id="game-eat-button"
                onMouseDown={_ => this.setState({activeBtn: 0})}
                onMouseLeave={_ => this.setState({activeBtn: null})}
                onClick={_ => this.state.onDecideEat(true)}/>
            <button
                className={[
                    "tile-btn",
                    this.state.shown ? "shown" : "hidden",
                    this.state.activeBtn === 1 ? "active" : ""
                ].join(" ")}
                id="game-eat-cancel"
                onMouseDown={_ => this.setState({activeBtn: 1})}
                onMouseLeave={_ => this.setState({activeBtn: null})}
                onClick={_ => this.state.onDecideEat(false)}>
                唔食住
            </button>
        </div>;
    }
}
