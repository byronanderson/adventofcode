const fs = require('fs');
const path = require('path');
const { affectedPoints, whereFits } = require('./index');

function input() {
  return fs.readFileSync(path.join(__dirname, "input.txt")).toString('utf8').trim().split(",").map(x => parseInt(x));
}

async function part1() {
  console.log("part 1: ", await affectedPoints(input(), 50, 50));
}

async function part2() {
  const [x, y] = await whereFits(input(), 100, 100);
  console.log("part 2: ", x * 10000 + y);
}

async function main() {
  await part1();
  await part2();
}

main();
