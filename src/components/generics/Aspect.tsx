import React, {useCallback, useState} from "react";
import {useResizeDetector} from "react-resize-detector";

export default function Aspect(props: React.PropsWithChildren<{
    aspect?: number,
    onResize?: (width: number, height: number) => void
}>) {

    const onResize = useCallback((parentWidth: number, parentHeight: number) => {
        parentHeight = parentHeight - 16 * window.devicePixelRatio; //padding
        parentWidth = parentWidth - 16 * window.devicePixelRatio; //padding
        const aspect = props.aspect || 16 / 9;
        let w;
        let h;

        if (parentWidth > parentHeight * aspect) {
            w = parentHeight * aspect;
            h = parentHeight;
        } else {
            w = parentWidth;
            h = parentWidth / aspect;
        }

        setInnerWidth(w);
        setInnerHeight(h);
        if (props.onResize)
            props.onResize(w, h);
    }, []);
    const {width, height, ref} = useResizeDetector({onResize});

    const [innerWidth, setInnerWidth] = useState(0);
    const [innerHeight, setInnerHeight] = useState(0);

    return <div ref={ref} className="w-screen h-screen bg-white flex">
        <div className="bg-purple-900 rounded-xl overflow-hidden m-auto relative"
             style={{width: `${innerWidth}px`, height: `${innerHeight}px`}}>
            {props.children}
        </div>
    </div>;
}
