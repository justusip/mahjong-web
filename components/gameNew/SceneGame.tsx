import React, {useEffect, useState} from "react";
import {Socket} from "socket.io-client";
import ThreeScene from "./ThreeScene";
import {Renderer, Scene} from "three";
import {Messages} from "../../network/Messages";
import Tile from "../../game/mechanics/Tile";
import Meld from "../../game/mechanics/Meld";
import GameManager from "../../game/graphics/GameManager";
import TempPrompt from "./TempPrompt";
import {ms} from "../../utils/Delay";

export default function SceneGame(props: {
    socket: Socket
}): React.ReactElement {

    let gm: GameManager;

    const onStart = async (scene: Scene, renderer: Renderer) => {
        gm = new GameManager(scene);
        gm.onInit();

        props.socket.emit(Messages.ROOM_CREATE, {});
        await ms(100);
        props.socket.emit(Messages.ROOM_START, {});
        await ms(100);
    };

    const [prompt, setPrompt] = useState(null);

    useEffect(() => {
        if (!props.socket)
            return;
        props.socket.on(Messages.ON_GAME_START, (
            pid: number,
            names: string[]
        ) => {
            gm.onRoomStart(pid);
            props.socket.emit(Messages.DECIDE_READY);
        });

        props.socket.on(Messages.ON_GUK_START, (
            _players: [
                hotbar: (number | null)[],
                melds: { a: number, b: number[] }[],
                flowers: number[]
            ][],
            fung: number,
            guk: number
        ) => {
            const players = _players.map(([hotbar, melds, flowers]) => ({
                hotbar: hotbar.map(o => !o ? null : Tile.deserialize(o)),
                melds: melds.map(o => Meld.deserialize(o)),
                flowers: flowers.map(o => Tile.deserialize(o))
            }));
            gm.onGukStart(players, fung, guk);
        });

        props.socket.on(Messages.DECIDE_PROMPT, (
            _availMelds: { a: number, b: number[] }[],
            availSik: boolean
        ) => {
            const availMelds = _availMelds.map(o => Meld.deserialize(o));
            setPrompt({availMelds, availSik});
        });

        props.socket.on(Messages.ON_SOMEONE_DREW, (
            pid: number,
            _drewTile: number | null,
            tilesLeft: number
        ) => {
            const drewTile = !_drewTile ? null : Tile.deserialize(_drewTile);
            gm.onSomeoneDrew(pid, drewTile);
        });

        props.socket.on(Messages.ON_SOMEONE_DISCARD, (
            pid: number,
            _discarded: number
        ) => {
            const discarded = Tile.deserialize(_discarded);
            gm.onSomeoneDiscard(pid, discarded);
        });

        props.socket.on(Messages.ON_SOMEONE_MERGE, (
            pid: number,
            _meld: { a: number, b: number[] }
        ) => {
            const meld = Meld.deserialize(_meld);
            gm.onSomeoneMerge(pid, meld);
        });

        props.socket.on(Messages.ON_GUK_END, (
            draw: boolean,
            scores: number[],
            scoreDiff: number[],
            _sikInfo: [
                pid: number,
                faan: number,
                extraTile: number,
                hotbar: number[],
                melds: { a: number, b: number[] }[],
                flowers: number[],
            ],
        ) => {
            if (draw) {

            } else {
                const [pid, faan, _extraTile, _hotbar, _melds, _flowers] = _sikInfo;
                const extraTile = Tile.deserialize(_extraTile);
                const hotbar = _hotbar.map(o => Tile.deserialize(o));
                const melds = _melds.map(o => Meld.deserialize(o));
                const flowers = _flowers.map(o => Tile.deserialize(o));
                const allTiles = [...melds.flatMap(m => m.tiles), ...flowers, ...hotbar];
                gm.onSomeoneSik(pid, allTiles, extraTile);
            }
        });
        return () => {
            props.socket.off(Messages.ON_GUK_START);
            props.socket.off(Messages.DECIDE_PROMPT);
            props.socket.off(Messages.ON_SOMEONE_DREW);
            props.socket.off(Messages.ON_SOMEONE_DISCARD);
            props.socket.off(Messages.ON_SOMEONE_MERGE);
        };
    }, [props.socket]);

    return <div className={"w-screen h-screen overflow-hidden"}>
        <TempPrompt prompt={prompt} onDecide={(decision: number) => {
            setPrompt(null);
            props.socket.emit(Messages.DECIDE_PROMPT, decision);
        }}/>
        <ThreeScene onStart={onStart}/>
    </div>;
};
