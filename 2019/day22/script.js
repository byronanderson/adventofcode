const fs = require("fs");
const path = require("path");
const { findIndex } = require("ramda");
const { shuffle, deckFactory, reverseShuffle } = require("./index");

function input() {
  return fs
    .readFileSync(path.join(__dirname, "input.txt"))
    .toString("utf8")
    .trim()
    .split("\n");
}

const operations = input();

async function part1() {
  console.log(
    "part 1: ",
    findIndex(x => x === 2019, shuffle(deckFactory(10007), operations))
  );
}

async function part2() {
  let deck = { position: 2020, length: 119315717514047 };
  let i = 0;
  do {
    deck = reverseShuffle(deck, operations);
    i++;
    if (i % 100000 === 0) console.log(i);
    // console.log(i, JSON.stringify(String(deck.position)));
  } while (deck.position !== 2020);
  console.log("found", i);

  console.log("part 2: ", deck);
}

async function main() {
  await part1();
  await part2();
}

main();
