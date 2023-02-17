import type {NextPage} from "next";
import React, {useEffect} from "react";

import GameEngine from "../components/game/GameEngine";

class OwO {
    constructor() {
        console.log("Init");
    }
}

const Home: NextPage = () => {

    const [engine, setEngine] = React.useState(null);

    useEffect(() => {

        setEngine(new GameEngine());

    }, []);

    return <div></div>;
};

export default Home;
