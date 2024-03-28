import express from "express";
import session from "express-session";
import fs from "fs";
import http from "http";
import https from "https";
import {Server, Socket} from "socket.io";
import "@/utils/ArrayExt";

import {ArgumentParser} from "argparse";

// import {route} from "@/server/routes/Route";
import {log} from "@/utils/Log";
import {createProxyMiddleware} from "http-proxy-middleware";
import Hub from "@/server/matchmaking/Hub";
import {AddressInfo} from "net";

const parser = new ArgumentParser({description: "Mahjong Core"});
parser.add_argument("--dev", {action: "store_true", help: "Enable development mode."});
parser.add_argument("--ssl", {action: "store_true", help: "In production mode, enable HTTPS mode. Need to also provide --cert and --key."});
parser.add_argument("--cert", {help: "Location of HTTPS certificate chain (e.g. /etc/letsencrypt/live/.../fullchain.pem)"});
parser.add_argument("--key", {help: "Location of HTTPS private key (e.g. /etc/letsencrypt/live/.../privkey.pem)"});
let args = parser.parse_args();

async function main() {
    let server: http.Server | https.Server | null = null;
    let httpRedirector: http.Server | null = null;

    const app = express();

    if (args.dev && !args.ssl) {
        server = http.createServer(app);
        await new Promise<void>(r => server!.listen(8080, r));
        // app.use("/", createProxyMiddleware({
        //         target: "http://localhost:3000",
        //         ws: true
        //     })
        // );
    } else if (!args.dev && !args.ssl) {
        server = http.createServer(app);
        await new Promise<void>(r => server!.listen(80, r));
    } else if (!args.dev && args.ssl) {
        if (!args.cert || !args.key) {
            console.error("Please provide both --cert & --key.");
            return;
        }
        for (const p of [args.cert, args.key]) {
            if (!fs.existsSync(p)) {
                console.error(`Cannot find ${p}.`);
                return;
            }
        }
        server = https.createServer({
            cert: fs.readFileSync(args.cert),
            key: fs.readFileSync(args.key)
        }, app);
        await new Promise<void>(r => server!.listen(443, r));
        httpRedirector = http.createServer(
            (req, res) => {
                res.writeHead(301, {"Location": "https://" + req.headers["host"] + req.url});
                res.end();
            }
        );
        await new Promise<void>(r => httpRedirector!.listen(80, r));
    } else {
        console.error("Cannot use --ssl in dev mode.");
        return;
    }

    console.log(`Serving static web content on http://localhost:${(server.address() as AddressInfo).port}`);
    if (httpRedirector)
        console.log(`Redirecting from http://localhost:${(httpRedirector.address() as AddressInfo).port}`);

    app.use(express.json());
    app.use(session({
        secret: "065a38a5-1038-4660-a25e-83018a6eec00",
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    }));
    // app.use(route);

    const hub = new Hub();
    const io = new Server(server, {cors: {origin: "*"}});
    io.on("connection", (s: Socket) => hub.onSocketConnect(s));
    log(`Listening incoming Socket.IO connection on ws://localhost:${(server.address() as AddressInfo).port}`);
}

main().then();
