import type {AppProps} from 'next/app';

import '../styles/globals.css';
import "../styles/animations.css";
import "../styles/globals.css";

import NoSSR from "../utils/NoSSR";

export default function MyApp({Component, pageProps}: AppProps) {
    return <NoSSR>
        <Component {...pageProps} />
    </NoSSR>;
}
