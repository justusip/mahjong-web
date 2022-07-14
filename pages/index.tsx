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
};

export default Home;
