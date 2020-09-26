const fs = require("fs");
const path = require("path");
const { all, none } = require("ramda");
const { parse, findRepeat } = require("./index");

function input() {
  const text = fs
    .readFileSync(path.join(__dirname, "input.txt"))
    .toString("utf8")
    .trim();
  return parse(text);
}

async function part1() {
  console.log(
    "part 1: ",
    findRepeat(input())
  );
}

async function part2() {
  console.log(
    "part 2: ",
  );
}


async function main() {
  await part1();
  await part2();
}

main();
