import type {NextPage} from "next";
import React from "react";
import {useResizeDetector} from "react-resize-detector";

import GameEngine from "../components/game/GameEngine";


const Home: NextPage = () => {

    const [engine, setEngine] = React.useState(null);
    const [fps, setFps] = React.useState<number>(0);

    const onResize = React.useCallback((width: number, height: number) => {
        if (engine)
            engine.onResize(width, height);
    }, [engine]);
    const {width, height, ref} = useResizeDetector({onResize});

    React.useEffect(() => {
        const engine = new GameEngine();
        setEngine(engine);
        engine.onInit(ref.current);
        engine.onResize(width, height);

        let frameId = 0;
        let prevElapsedMs = 0;
        const deltaTimes: number[] = [];
        const animate = (elapsedMs: number) => {
            const deltaTime = elapsedMs - prevElapsedMs;

            deltaTimes.push(deltaTime);
            if (deltaTimes.length > 60)
                deltaTimes.shift();
            let avgFps = 0;
            for (let i = 0; i < deltaTimes.length; i++)
                avgFps += deltaTimes[i];
            avgFps /= deltaTimes.length;
            setFps(1000 / avgFps);

            engine.onUpdate(deltaTime);

            prevElapsedMs = elapsedMs;
            frameId = requestAnimationFrame(animate);
        };
        frameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(frameId);
            engine.onEnd();
            setEngine(null);
        };
    }, []);

    return <div className="w-screen h-screen">
        <div className="w-full h-full absolute">
            <div>{fps.toFixed(2)} fps</div>
        </div>
        <div className="w-full h-full" ref={ref}/>
    </div>;
};

export default Home;
