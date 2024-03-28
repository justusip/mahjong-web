import type {AppProps} from "next/app";
import "@/styles/globals.css";
import NoSSR from "@/components/generic/NoSSR";

export default function MyApp({Component, pageProps}: AppProps) {
    return <NoSSR>
        <Component {...pageProps} />
    </NoSSR>;
}
