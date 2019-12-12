const execute = require('../day9/index.js');

function boot({ program, output }) {
  let result;
  const myspy = n => {
    result = n;
  };
  let inputIndex = 0;
  // these inputs are wrong, this needs to be stateful execution now...
  // I want an elixir flow pipeline!
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

function applyTurn(startingDirection, turn) {
  switch (startingDirection) {
    case "up":
      return turn === 0 ? "left" : "right";
    case "down":
      return turn === 0 ? "right" : "left";
    case "left":
      return turn === 0 ? "down" : "up";
    case "right":
      return turn === 0 ? "up" : "down";
  }
}

async function followProcedure(program, startingColor) {
  let position = [0, 0];
  let direction = 'up';
  let output = [];
  let map = {};
  const brain = boot({
    program,
    output: function(x) {
      output.push(x);
      if (output.length === 2) {
        let color = output[0];
        let turn = output[1];
        output = [];
        map = {
          ...map,
          [position.join(',')]: color
        };
        direction = applyTurn(direction, turn);
        switch (direction) {
          case 'up':
            position = [position[0], position[1] - 1];
            break;
          case 'down':
            position = [position[0], position[1] + 1];
            break;
          case 'right':
            position = [position[0] + 1, position[1]];
            break;
          case 'left':
            position = [position[0] - 1, position[1]];
            break;
        }
        brain.queueInput(map[position.join(",")] || 0);
      }
    }
  });
  brain.queueInput(startingColor);
  await brain.promise;
  return map;
}

module.exports = { followProcedure };
