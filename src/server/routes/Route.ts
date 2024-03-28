import crypto from "crypto";
import express from "express";
import monk, {ICollection} from "monk";

import {log} from "@/utils/Log";

const route = express.Router();

const db = monk("127.0.0.1:27017/mah");
db.catch(ex => log(ex));
const users: ICollection = db.get("users");

declare module "express-session" {
    interface SessionData {
        uid: string;
    }
}

function calc_hash(str: string): string {
    return crypto.createHash("sha256").update(str).digest("hex");
}

route.all("/api/status", async (req, res) => {
    res.json({ok: true});
});

route.post("/api/return", async (req, res) => {
    const _id = req.session.uid;
    if (_id) {
        const doc = await users.findOne({_id});
        res.json({
            ok: true,
            me: {
                uid: _id,
                username: doc.username
            }
        });
        return;
    }
    res.json({ok: false});
});

route.post("/api/exist", async (req, res) => {
    const username = req.body.username;
    const doc = await users.findOne({username});
    res.json({ok: !!doc});
});

route.post("/api/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const hash = calc_hash(password);
    const doc = await users.findOne({username, hash});
    if (doc) {
        req.session.uid = doc._id;
    }
    res.json({ok: !!doc});
});

route.post("/api/register", async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const hash = calc_hash(password);
    await users.insert({
        username, email, hash,
        friends: []
    });
    res.json({ok: true});
});

route.post("/api/forgot_password", async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    //TODO
    res.json({ok: false});
});

route.use("*", async (req, res, next) => {
    const _id = req.session.uid;
    if (!_id) {
        res.status(401).json({ok: false, error: "Unauthorized"});
        return;
    }
    return next();
});

route.post("/api/change_password", async (req, res) => {
    const _id = req.session.uid;
    const oldPass = req.body.oldPass;
    const newPass = req.body.newPass;
    const oldPassHash = calc_hash(oldPass);
    const newPassHash = calc_hash(newPass);
    if (!await users.findOne({_id, hash: oldPassHash})) {
        res.json({ok: false, error: "The old password is not valid."});
        return;
    }
    await users.update({_id}, {$set: {hash: newPassHash}});
    res.json({ok: true});
});

route.get("/api/friends", async (req, res) => {
    const _id = req.session.uid;
    const docs = await users.findOne({_id});
    const out: { name: string }[] = [];
    for (const frdUid of docs.friends) {
        const frdDoc = await users.findOne({_id: frdUid});
        out.push(frdDoc.username);
    }
    res.json({ok: true, friends: out});
});

route.post("/api/friend", async (req, res) => {
    const _id = req.session.uid;
    const uid = req.body.uid;
    //TODO
    await users.update({_id}, {push: {friends: uid}});
    res.json({ok: true});
});

route.delete("/api/friend", async (req, res) => {
    const _id = req.session.uid;
    const uid = req.body.uid;
    await users.update({_id}, {$pull: {friends: uid}});
    res.json({ok: true});
});

export {route};
