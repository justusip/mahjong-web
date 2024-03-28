import React, {useCallback, useContext, useEffect} from "react";
import {useResizeDetector} from "react-resize-detector";

import GameEngine from "./GameEngine";
import {GameContext} from "../GameProvider";
import EventType from "@/events/EventType";
import Aspect from "@/components/generic/Aspect";
import classNames from "classnames";

export default function PageGame() {
    const ctx = useContext(GameContext);
    const [gameEngine, setGameEngine] = React.useState<GameEngine>(null);

    const onResize = useCallback((width: number, height: number) => {
        if (gameEngine)
            gameEngine.onResize(width, height);
    }, [gameEngine]);
    const {width, height, ref} = useResizeDetector({onResize});

    useEffect(() => {
        if (!ref.current)
            return;

        const ge = new GameEngine(ref.current);
        setGameEngine(ge);

        ge.regSocket(ctx.socket); //TODO set socket again later if ctx.socket changes
        ge.onStart();

        const updateInterval = 1 / 30 * 1000;
        let prevTime = 0;
        let animFrameId = 0;
        const loop = () => {
            animFrameId = requestAnimationFrame(loop);
            const curTime = performance.now();
            if (curTime > prevTime + updateInterval) {
                prevTime = curTime;
                ge.onUpdate(curTime - prevTime);
            }
        };
        animFrameId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(animFrameId);
            ge.unregSocket(ctx.socket);
            ge.onEnd();
            setGameEngine(null);
        };
    }, [ref.current]);

    let showReference = true;
    showReference = false;
    if (showReference)
        return <div className="w-screen h-screen flex place-items-center place-content-center">
            <img className="opacity-30 h-full" src="img/Screenshot 2022-07-20 at 9.20.33 PM.png"/>
        </div>;

    const buttons = ["碰", "上", "槓", "跳過"];

    return <div className="w-full h-full bg-neutral-700">
        {/*<div className="absolute p-2">OK<br/>socket_connected {ctx.socket.connected + ""}</div>*/}
        <Aspect>
            <div className={"absolute left-1/2 top-[5%]"}>local-2</div>
            <div className={"absolute right-[3%] bottom-[55%]"}>local-1</div>
            <div className={"absolute left-[3%] bottom-[55%]"}>local-3</div>
            <div className={"absolute bottom-[20%] left-[30%]"}>local-0</div>
            {
                buttons.map((_, i) =>
                    <div className={classNames(
                        "absolute w-[8%] h-[5%] bottom-[20%] text-[90%]",
                        "border border-white flex place-items-center place-content-center",
                        "cursor-pointer hover:bg-white/20 active:bg-black/20"
                    )}
                         style={{right: `${18 + 9 * i}%`}}>
                        {buttons[i]}
                    </div>
                )
            }
        </Aspect>
        <canvas ref={ref}
                className="block w-full h-full"
                onPointerMove={e => {
                    if (gameEngine) {
                        gameEngine.onPointerMove(
                            (e.clientX / window.innerWidth) * 2 - 1,
                            -(e.clientY / window.innerHeight) * 2 + 1
                        );
                    }
                }}
                onPointerDown={e => {
                    if (gameEngine) {
                        gameEngine.onPointerDown();
                    }
                }}/>
    </div>;
}
