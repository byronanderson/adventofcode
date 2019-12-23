const fs = require("fs");
const path = require("path");
const { all, none } = require("ramda");
const { bootAll } = require("./index");

function input() {
  return fs
    .readFileSync(path.join(__dirname, "input.txt"))
    .toString("utf8")
    .trim()
    .split(",")
    .map(x => parseInt(x));
}

async function part1() {
  console.log(
    "part 1: ",
    (await new Promise(resolve => bootAll(input(), resolve))).y
  );
}

async function part2() {
  console.log(
    "part 2: ",
    await new Promise(resolve => {
      let value = null;
      const computers = bootAll(input(), packet => {
        value = packet;
      });
      const idle = () => all(computer => computer.idle(), computers);
      let sentPacket = {};
      setInterval(() => {
        if (idle() && value) {
          computers[0].queueInput(value.x);
          computers[0].queueInput(value.y);
          if (sentPacket.y === value.y) resolve(value.y)
          sentPacket = value;
        }
      }, 5);
    })
  );
}


async function main() {
  await part1();
  await part2();
}

main();
