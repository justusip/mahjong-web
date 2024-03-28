function log(msg: string) {
    console.log("[\x1b[36m+\x1b[0m][" + new Date().toLocaleString() + "] " + msg);
}

export {log};
