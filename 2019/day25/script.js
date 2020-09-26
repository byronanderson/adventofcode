const fs = require("fs");
const path = require("path");
const { play } = require("./index");

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
    await play(
      input(),
      `
south
take astrolabe
west
take hologram
south
take space law space brochure
west
take wreath
west
take hypercube
east
east
north
east
south
take cake
west
north
take coin
south
east
east
south
east
take food ration
south
drop space law space brochure
drop food ration
drop astrolabe
drop hologram
drop cake
drop wreath
drop coin
drop hypercube
take hologram
take cake
take coin
take hypercube
south
  `.trim().concat("\n")
    )
  );
}

async function part2() {
  console.log("part 2: ");
}

async function main() {
  await part1();
  await part2();
}

main();
