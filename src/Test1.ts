// import KongGame from "@/server/logic/KongGame";
import ConsolePlayer from "@/server/players/ConsolePlayer";
import RobotPlayer from "@/server/players/RobotPlayer";
import KongGame from "@/server/logic/KongGame";

const g = new KongGame(
    [
        new ConsolePlayer("Debugger-Plasma"),
        new RobotPlayer("CPU-1"),
        new RobotPlayer("CPU-2"),
        new RobotPlayer("CPU-3")
    ]
);
g.runFull();


// import { parseArgs } from 'node:util';
// const args = ['-f', '--bar', 'b'];
// const options = {
//   prod: {
//     type: 'boolean',
//     short: 'f'
//   },
//   bar: {
//     type: 'string'
//   }
// };
// const {
//   values,
//   positionals
// } = parseArgs({ args, options });
// console.log(values, positionals);