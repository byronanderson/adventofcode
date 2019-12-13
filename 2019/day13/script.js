const fs = require('fs');
const path = require('path');
const { convert, play } = require('./index');

function input() {
  return fs.readFileSync(path.join(__dirname, "input.txt")).toString('utf8').trim().split(",").map(x => parseInt(x));
}

const insertQuarter = program => {
  const newProgram = [...program];
  newProgram[0] = 2;
  return newProgram;
};

async function main() {
  const grid = await convert(input());
  console.log(Object.values(grid).filter(x => x === 2).length)

  play(insertQuarter(input()));
}

main();
