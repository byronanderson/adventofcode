const fs = require('fs');
const path = require('path');
const { calibrate, followPath } = require('./index');

function input() {
  return fs.readFileSync(path.join(__dirname, "input.txt")).toString('utf8').trim().split(",").map(x => parseInt(x));
}

async function part1() {
  console.log("part 1: ", await calibrate(input()));
}

async function part2() {
  const data = input();
  data[0] = 2;
  console.log(await followPath(data));
}

async function main() {
  await part1();
  await part2();
}

main();
