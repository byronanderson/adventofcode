const fs = require('fs');
const path = require('path');
const { sortBy } = require('ramda');
const { followProcedure } = require('./index');

function input() {
  return fs.readFileSync(path.join(__dirname, "input.txt")).toString('utf8').trim().split(",").map(x => parseInt(x));
}

async function main() {
  //console.log(Object.keys(await followProcedure(input(), 0)));
  const map = await followProcedure(input(), 1);
  render(map);
}
main();

function render(map) {
  const coordinates = Object.keys(map).map(key => key.split(",").map(x => parseInt(x)));
  console.log(coordinates);
  const minX = sortBy(coord => coord[0], coordinates)[0][0];
  const minY = sortBy(coord => coord[1], coordinates)[0][1];
  const maxX = sortBy(coord => -coord[0], coordinates)[0][0];
  const maxY = sortBy(coord => -coord[1], coordinates)[0][1];
  console.log([minX, maxX, minY, maxY]);
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      process.stdout.write(map[`${x},${y}`] === 1 ? "x" : " ");
    }
    process.stdout.write("\n");
  }
}
