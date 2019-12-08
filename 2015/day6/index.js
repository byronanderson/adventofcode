const { Map } = require('immutable');
const initialLights = () => {
  const lights = {};
  for (let i = 0; i < 1000; i++) {
    for (let j = 0; j < 1000; j++) {
      lights[`${i},${j}`] = 0;
    }
  }
  return Map(lights);
}

function adjust(lights, line, version) {
  const matchdata = line.match(/((turn on)|(turn off)|(toggle)) (\d+),(\d+) through (\d+),(\d+)/)
  matchdata[1] // turn on | turn off | toggle
  matchdata[5] // x1
  matchdata[6] // y1
  matchdata[7] // x2
  matchdata[8] // y2

  const command = {
    fn: matchdata[1],
    from: [parseInt(matchdata[5]), parseInt(matchdata[6])],
    to: [parseInt(matchdata[7]), parseInt(matchdata[8])],
  };
  switch (command.fn) {
    case "turn on":
      return doAdjustments(lights, command, brightness => brightness + 1);
    case "turn off":
      return doAdjustments(lights, command, brightness => Math.max(brightness - 1, 0));
    case "toggle":
      return doAdjustments(lights, command, brightness => brightness + 2);
  }
  return lights;
}

function doAdjustments(lights, { from, to }, adjuster) {
  let newLights = lights;
  for (let i = from[0]; i < to[0] + 1; i++) {
    for (let j = from[1]; j < to[1] + 1; j++) {
      const position = `${i},${j}`;
      newLights = newLights.set(position, adjuster(lights.get(position)));
    }
  }
  return newLights;
}

function litCount(lights) {
  return lights.reduce((a, b) => a + b, 0);
}

const fs = require('fs');
const path = require('path');
function input() {
  return fs.readFileSync(path.join(__dirname, 'input.txt')).toString('utf8');
}

const adjustedLights = input().trim().split("\n").reduce(adjust, initialLights());
console.log(litCount(adjustedLights));

