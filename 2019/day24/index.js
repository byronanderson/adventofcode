const { times } = require("ramda");

function parse(string) {
  const dimensions = [5, 5];
  const grid = {};
  const items = string
    .trim()
    .split("\n")
    .map(line => line.split(""));
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      grid[`${x},${y}`] = items[y][x];
    }
  }
  return { grid, dimensions };
}

function tick({ grid, dimensions }) {
  const newGrid = { ...grid };
  for (let y = 0; y < dimensions[1]; y++) {
    for (let x = 0; x < dimensions[0]; x++) {
      const adjacent = countAdjacent(grid, x, y);
      console.log(x, y, adjacent);
      const previousValue = grid[`${x},${y}`];
      if (adjacent !== 1 && previousValue === "#") {
        //console.log('dying', x, y, adjacent)
        newGrid[`${x},${y}`] = ".";
      } else if ((adjacent === 1 || adjacent === 2) && previousValue === ".") {
        //console.log('spawning', x, y, adjacent)
        newGrid[`${x},${y}`] = "#";
      }
    }
  }
  return { dimensions, grid: newGrid };
}
function log(x) {
  console.log(x);
  return x;
}
function countAdjacent(grid, x, y) {
  const count = (x, y) => (grid[`${x},${y}`] === "#" ? 1 : 0);
  return count(x + 1, y) + count(x - 1, y) + count(x, y + 1) + count(x, y - 1);
}

function map(eris) {
  return times(i => {
    const y = Math.floor(i / eris.dimensions[0]);
    const x = i % eris.dimensions[0];
    const value = eris.grid[`${x},${y}`];
    if (x === eris.dimensions[0] - 1) {
      return value + "\n";
    } else {
      return value;
    }
  }, eris.dimensions[0] * eris.dimensions[1]).join("");
}

function findRepeat(eris) {
  let value = eris;
  const set = new Set();
  set.add(map(eris));
  let repeat = false;
  let i = 0;
  console.log(map(eris));
  do {
    i++;
    value = tick(value);
    const newmap = map(value);
    repeat = set.has(newmap);
    set.add(newmap);
  } while (!repeat);

  return parseInt(map(value).replace(/\s/g, "").replace(/#/g, '1').replace(/\./g, '0').split("").reverse().join(""), 2);
}

module.exports = {
  parse,
  map,
  findRepeat
};
