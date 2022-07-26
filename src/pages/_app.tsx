import type {AppProps} from 'next/app';

import '../styles/globals.css';
import "../styles/animations.css";
import "../styles/globals.css";

export default function MyApp({Component, pageProps}: AppProps) {
    return <Component {...pageProps} />;
}
