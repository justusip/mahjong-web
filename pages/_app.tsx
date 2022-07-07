import '../styles/globals.css';
import type {AppProps} from 'next/app';

import "../styles/animations.css";
import "../styles/game.css";
import "../styles/globals.css";
import "../styles/menu.css";
import "../styles/room.css";
import "../styles/splash.css";

export default function MyApp({Component, pageProps}: AppProps) {
    return <Component {...pageProps} />;
}
