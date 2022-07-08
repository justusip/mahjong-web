const ms = (ms: number) => new Promise(r => setInterval(r, ms));
export {ms};
