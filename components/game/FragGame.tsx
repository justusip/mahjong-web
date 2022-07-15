import {Socket} from "socket.io-client";
import React, {useEffect, useRef, useState} from "react";
import {Messages} from "../../network/Messages";
import Tile from "../../generics/Tile";
import Meld from "../../generics/Meld";
import SceneGame from "./SceneGame";

export default function FragGame(props: {
    socket: Socket
}) {

    const scene = useRef<typeof SceneGame>();

    useEffect(() => {
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
            scene.current.reset();
        });

        props.socket.on(Messages.DECIDE_PROMPT, (
            pid: number,
            _availMelds: { a: number, b: number[] }[],
            availSik: boolean
        ) => {
            const availMelds = _availMelds.map(o => Meld.deserialize(o));
        });

        props.socket.on(Messages.ON_SOMEONE_DREW, (
            pid: number,
            _drewTile: number | null,
            tilesLeft: number
        ) => {
            const drewTile = !_drewTile ? null : Tile.deserialize(_drewTile);

        });

        props.socket.on(Messages.ON_SOMEONE_DISCARD, (
            pid: number,
            _discarded: number
        ) => {
            const discarded = Tile.deserialize(_discarded);
        });

        props.socket.on(Messages.ON_SOMEONE_MERGE, (
            pid: number,
            _meld: { a: number, b: number[] }
        ) => {
            const meld = Meld.deserialize(_meld);
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

    // return <div className={"w-screen h-screen bg-black flex place-items-center place-content-center p-[16px]"}>
    //     <div className={"w-full max-w-[calc(100vh-32px)] bg-neutral-800 rounded overflow-hidden aspect-square m-auto"}></div>
    // </div>;

    return <SceneGame ref={scene}/>;
}
