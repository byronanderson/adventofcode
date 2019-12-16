const execute = require('../day9/index.js');
const { last } = require('ramda');

async function followPath(program, path) {
  return new Promise(resolve => {
    let i = 0;
    let statuses = [];
    execute({
      program,
      takeInput: () => {
        const input = path[i++];
        if (typeof input === "number") {
          return input;
        } else {
          resolve(explain(last(statuses)));
          return new Promise(resolve => {}) // never bother to finish
        }
      },
      doOutput: status => {
        statuses.push(status);
      }
    })
  });
}

const explanations = {
  0: "wall",
  1: "empty",
  2: "oxygen system"
};
const explain = code => explanations[code];

const directionCodes = {
  north: 1,
  south: 2,
  west: 3,
  east: 4,
};
const directionCode = name => directionCodes[name];

function move([longitude, latitude], direction) {
  switch (direction) {
    case "north":
      return [longitude, latitude + 1];
    case "south":
      return [longitude, latitude - 1];
    case "west":
      return [longitude + 1, latitude];
    case "east":
      return [longitude - 1, latitude];
  }
}
const found = map => Object.values(map).find(x => x === 'oxygen system')

async function mapOut(program, startingPath = [], map = {}, bestPath = Infinity) {
  const startingLocation = startingPath.reduce(move, [0, 0]);
  for (let direction of ["north", "north", "south", "east", "west"]) {
    const path = [...startingPath, direction];
    const location = move(startingLocation, direction);
    const locationString = location.join(",");
    if (!map[locationString]) {
      const value = await followPath(program, path.map(directionCode));
      map[locationString] = value;
      console.log(Object.values(map).length);
      if (value !== 'wall') {
        map = {
          ...map,
          ...(await mapOut(program, [...startingPath, direction], map))
        };
      }
    }
    if (map[locationString] === 'oxygen system') {
      console.log("path found", path.length);
    }
  }
  return map;
}

function filled(map) {
  return Object.values(map).filter(x => x === 'empty').length === 0;
}

function fill(map) {
  const newMap = { ...map };
  Object.entries(map).filter(([loc, stat]) => stat === 'filled').forEach(([loc]) => {
    const [x, y] = loc.split(",").map(x => parseInt(x));
    function fill(x, y) {
      if (newMap[`${x},${y}`] !== 'wall') {
        newMap[`${x},${y}`] = 'filled';
      }
    }
    fill(x + 1, y);
    fill(x - 1, y);
    fill(x, y + 1);
    fill(x, y - 1);
  });
  return newMap;
}
function maxPathLength(map, startingLocation, visited = []) {
  map = {
    ...map,
    [startingLocation]: 'filled'
  };
  let steps = 0;
  while (!filled(map)) {
    steps++;
    map = fill(map);
    render(map);
  }
  return steps;
}

function render(grid) {
  const minX = Object.keys(grid).map(x => parseInt(x.split(",")[0])).sort((x, y) => x - y)[0];
  const maxX = Object.keys(grid).map(x => parseInt(x.split(",")[0])).sort((x, y) => y - x)[0];
  const minY = Object.keys(grid).map(x => parseInt(x.split(",")[1])).sort((x, y) => x - y)[0];
  const maxY = Object.keys(grid).map(x => parseInt(x.split(",")[1])).sort((x, y) => y - x)[0];
  const output = [];
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      let char;
      const location = `${x},${y}`;
      switch (grid[location]) {
        case "wall":
          char = '#';
          break;
        case "oxygen system":
          char = 'x';
          break;
        case "filled":
          char = '0';
          break;
        case "empty":
        default:
          char = location === '0,0' ? 'S' : ' ';
          break;
      }
      output.push(char);
    }
    output.push("\n");
  }
  process.stdout.write(output.join(""));
}

module.exports = { mapOut, maxPathLength, render };
