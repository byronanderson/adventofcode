const execute = require('../day9/index.js');

function boot({ program, output }) {
  let result;
  const myspy = n => {
    result = n;
  };

  const inputQueue = {
    resolves: [],
    items: [],
    enqueue: item => {
      if (inputQueue.resolves.length > 0) {
        const resolve = inputQueue.resolves.shift();
        resolve(item);
      } else {
        inputQueue.items.push(item);
      }
    },
    pop: () => {
      if (inputQueue.items.length > 0) {
        const input = inputQueue.items.shift();
        return input;
      } else {
        return new Promise(resolve => {
          inputQueue.resolves.push(resolve);
        });
      }
    }
  }
  const promise = execute({
    program,
    takeInput: inputQueue.pop,
    doOutput: output
  });
  return {
    promise,
    queueInput: inputQueue.enqueue
  };
}

async function convert(program) {
  let nums = [];
  const grid = {};
  function output(num) {
    nums.push(num);
    if (nums.length === 3) {
      grid[`${nums[0]},${nums[1]}`] = nums[2];
      nums = [];
    }
  }

  const logic = boot({ program, output });

  await logic.promise;
  return grid;
}

let i = 0;
function render(grid) {
  i++;
  const minX = Object.keys(grid).map(x => parseInt(x.split(",")[0])).sort((x, y) => x - y)[0];
  const maxX = Object.keys(grid).map(x => parseInt(x.split(",")[0])).sort((x, y) => y - x)[0];
  const minY = Object.keys(grid).map(x => parseInt(x.split(",")[1])).sort((x, y) => x - y)[0];
  const maxY = Object.keys(grid).map(x => parseInt(x.split(",")[1])).sort((x, y) => y - x)[0];
  const output = [`score: ${grid['-1,0']}, iterations: ${i}]\n`];
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      let char;
      switch (grid[`${x},${y}`]) {
        case 1:
          char = '#';
          break;
        case 2:
          char = 'x';
          break;
        case 3:
          char = '_';
          break;
        case 4:
          char = 'o';
          break;
        case 0:
        default:
          char = ' ';
          break;
      }
      // process.stdout.write(char);
      output.push(char);
    }
    //process.stdout.write("\n");
    output.push("\n");
  }
  process.stdout.write(output.join(""));
}

var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

let input = 0;
stdin.on('data', function(key){
  if (key == '\u001B\u005B\u0041') {
    // up
    input = 0;
  }
  if (key == '\u001B\u005B\u0043') {
    // right
    input = 1;
  }
  if (key == '\u001B\u005B\u0042') {
    // down
    input = 0;
  }
  if (key == '\u001B\u005B\u0044') {
    input = -1;
  }

  if (key == '\u0003') { process.exit(); }    // ctrl-c
});



const extractLocation = string => string.split(",").map(x => parseInt(x));

const findObject = (grid, object) => Object.entries(grid).filter(([location, obj]) => obj === object).map(([location, object]) => extractLocation(location))[0];

function optimalPlay(grid) {
  const paddleLocation = findObject(grid, 3);
  const ballLocation = findObject(grid, 4);
  if (ballLocation[0] > paddleLocation[0]) return 1;
  if (ballLocation[0] < paddleLocation[0]) return -1;
  return 0;
}

async function play(program) {
  let nums = [];
  let grid = {};
  function output(num) {
    nums.push(num);
    if (nums.length === 3) {
      grid[`${nums[0]},${nums[1]}`] = nums[2];
      nums = [];
    }
  }

  const promise = execute({
    program,
    takeInput: () => {
      render(grid);
      grid = {...grid};
      return optimalPlay(grid);
    },
    doOutput: output
  });

  await promise;
  console.log("final score: ", grid[`-1,0`]);
  return grid;
}

const delay = amt => new Promise(resolve => setTimeout(resolve, amt));

module.exports = { convert, play };
