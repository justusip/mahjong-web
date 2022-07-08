import type {NextPage} from "next";
import React from "react";
import {SharedStateProvider} from "../components/Store";
import App from "../components/App";

const Home: NextPage = () => {

    return <SharedStateProvider>
        <App/>
    </SharedStateProvider>;


    // switch (page) {
    //     case -1:
    //         return <PageMain/>;
    //     case 0:
    //         return <PageLogin/>;
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
