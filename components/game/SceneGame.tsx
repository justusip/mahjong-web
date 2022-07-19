import React, {useEffect, useState} from "react";
import {Socket} from "socket.io-client";
import ThreeScene from "./ThreeScene";
import {Messages} from "../../network/Messages";
import ElemPrompt from "./ElemPrompt";
import {ms} from "../../utils/Delay";
import * as THREE from "three";
import Aspect from "./Aspect";
import Tile from "../../game/Tile";
import Meld from "../../game/Meld";
import GameManager from "./GameManager";
import Resources from "./Resources";
import ElemHotbar from "./ElemHotbar";

export default function SceneGame(props: {
    socket: Socket
}): React.ReactElement {

    let gm: GameManager;

    const onStart = async (renderer: THREE.WebGLRenderer, scene: THREE.Scene) => {
        gm = new GameManager(scene, (hotbar: Tile[], drew: Tile | null) => {
            setHotbar(hotbar);
            setDrew(drew);
        });
        gm.onInit();

        Resources.getTexture("img/symbols.png").anisotropy = renderer.capabilities.getMaxAnisotropy();
        Resources.getTexture("img/symbols.png").encoding = THREE.sRGBEncoding;

        //TODO
        props.socket.emit(Messages.ROOM_CREATE, {});
        await ms(100);
        props.socket.emit(Messages.ROOM_START, {});
        await ms(100);
    };

    const [hotbar, setHotbar] = useState<Tile[]>([]);
    const [drew, setDrew] = useState<Tile | null>(null);
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

    const onDiscard = (tile: Tile) => {
        props.socket.emit(Messages.DECIDE_DISCARD, tile.serialize());
    };

    return <Aspect aspect={4 / 3}>
        <ElemPrompt prompt={prompt} onDecide={(decision: number) => {
            setPrompt(null);
            props.socket.emit(Messages.DECIDE_PROMPT, decision);
        }}/>
        <ElemHotbar hotbar={hotbar} drew={drew} onDiscard={onDiscard}/>
        <ThreeScene onStart={onStart}/>
    </Aspect>;
};
