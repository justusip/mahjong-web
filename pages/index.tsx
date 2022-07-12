import type {NextPage} from "next";
import React, {useEffect, useState} from "react";
import {SharedStateProvider} from "../components/Store";
import App from "../components/App";
import IsUsingMobile from "../utils/IsUsingMobile";

const Home: NextPage = () => {

    const [usingMobile, setUsingMobile] = useState(false);
    useEffect(() => {
        const usingMobile = IsUsingMobile();
        setUsingMobile(usingMobile);
        if (usingMobile)
            return;
    }, []);
    if (usingMobile) {
        return <div>請使用電腦瀏覽此網站。</div>;
    }

    return <SharedStateProvider>
        <App/>
    </SharedStateProvider>;


    // switch (page) {
    //     case -1:
    //         return <PageMain/>;
    //     case 0:
    //         return <OverlayLogin/>;
    //     case 1:
    //         return <PageRoom ref={r => layoutRoom = r}
    //                          onExit={() => {
    //                              setPage(0);
    //                              GameManager.ins.disconnect();
    //                          }}/>;
    //     case 2:
    //         return <PageGame ref={r => layoutGame = r}
    //                          onExit={() => setPage(0)}/>;
    // }
};

export default Home;
