import type {NextPage} from "next";
import React, {useEffect, useState} from "react";
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
    return <App/>;
};

export default Home;
