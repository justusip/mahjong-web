import React from "react";

export default abstract class ThreeReactElement extends React.Component<{}, {
    canvasRef: React.RefObject<HTMLCanvasElement>,
    startTime: number
    curTime: number
    fps: number,
    width: number,
    height: number,
    mosX: number,
    mosY: number
}> {

    animFrameId = -1;

    constructor(props: any) {
        super(props);
        // @ts-ignore
        this.state = {
            canvasRef: React.createRef<HTMLCanvasElement>(),
            fps: 0
        };
    }

    componentDidMount() {
        if (!this.state.canvasRef.current)
            return;
        // this.state.canvasRef.socket.emit(Messages.GUK_READY_START);

        this.onStart();
        this.setState({startTime: performance.now()});

        let prevTime = 0;
        let animFrameId = 0;
        let samples: number[] = [];
        const loop = () => {
            this.animFrameId = requestAnimationFrame(loop);

            const curTime = performance.now();
            if (curTime > prevTime + (1 / 30 * 1000)) {
                this.setState({curTime: curTime});
                samples.push(1000 / (curTime - prevTime));
                prevTime = curTime;

                this.onUpdate();
                this.onResize();

                if (samples.length > 100)
                    samples.shift();
                this.setState({
                    fps: samples.reduce((a, b) => a + b, 0) / samples.length
                });

                // ge.onUpdate(curTime - prevTime);
            }
        };
        this.animFrameId = requestAnimationFrame(loop);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.animFrameId);
        this.onEnd();
    }

    onResize() {
        if (!this.state.canvasRef.current)
            return;
        const canvas = this.state.canvasRef.current;
        let w = window.innerWidth;
        let h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
        this.setState({
            width: w, height: h
        });
    }

    abstract onStart(): void;

    abstract onUpdate(): void;

    abstract onEnd(): void;

    override render(): React.ReactElement {
        return <div className="w-screen h-screen">
            <div className="absolute p-2 font-mono">
                Mahj.io-dx-dev1<br/>
                {this.state.curTime?.toFixed(2)} ms<br/>
                {this.state.fps.toFixed(0)} FPS<br/>
                w {this.state.width} h {this.state.height}<br/>
                mosX {this.state.mosX} mosY {this.state.mosY}
            </div>
            <div></div>
            <div className={"absolute w-screen h-screen overflow-hidden flex place-items-center place-content-center"}>
                <div className={"w-full aspect-video border border-white relative"}>
                    <div className={"absolute left-1/2 top-[5%]"}>local-2</div>
                    <div className={"absolute right-[3%] bottom-[55%]"}>local-1</div>
                    <div className={"absolute left-[3%] bottom-[55%]"}>local-3</div>
                    <div className={"absolute bottom-[20%] left-[30%]"}>local-0</div>
                    {
                        [...new Array(4)].map((_, i) =>
                            <div
                                className={"absolute w-[8%] h-[5%] bottom-[20%] border border-white"}
                                style={{right: `${18 + 10 * i}%`}}
                            >
                                BTN{i}
                            </div>
                        )
                    }
                </div>
            </div>
            <canvas ref={this.state.canvasRef} className="block w-full h-full"
                    onPointerMove={e => {
                        this.setState({
                            mosX: (e.clientX / window.innerWidth) * 2 - 1,
                            mosY: -(e.clientY / window.innerHeight) * 2 + 1
                        });
                    }}
                    onPointerDown={e => {
                    }}
            />
        </div>;
    }

}
