const fs = require("fs");
const path = require("path");
const { all, none } = require("ramda");
const { programSpringbot } = require("./index");

function input() {
  return fs
    .readFileSync(path.join(__dirname, "input.txt"))
    .toString("utf8")
    .trim()
    .split(",")
    .map(x => parseInt(x));
}

// if any hole in 3 spaces in front of you
// and 4 spaces in front is land then jump

// last input should be:
// AND D J

// NOT A J
// NOT B T
// OR T J // either no ground on A or no ground on B
// NOT C T
// OR T J  // either (either no ground on A or no ground on B) or no ground on C
// AND D J

async function part1() {
  console.log(
    "part 1: ",
    await programSpringbot(input(), [
      "NOT A J",
      "NOT B T",
      "OR T J",
      "NOT C T",
      "OR T J",
      "AND D J",
      "WALK"
    ])
  );
}

async function part2() {
  console.log(
    "part 2: ",
    await programSpringbot(input(), [
      "NOT A J",
      "NOT B T",
      "OR T J",
      "NOT C T", 
      "OR T J", // there is any hole in 3 front spaces
      "NOT H T",
      "NOT T T",
      "OR E T", // if there is ground 8 ahead or 5 ahead, still looks good to jump
      "AND T J", // and there is ground 4 ahead
      "AND D J", // and there is ground 4 ahead
      "RUN"
    ])
  );
  //ABCDEFGHI
}


async function main() {
  await part1();
  await part2();
}

main();
