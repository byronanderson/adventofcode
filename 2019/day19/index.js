const execute = require("../day9/index");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const { memoizeWith, identity } = require("ramda");

async function mapOut(program, width, height) {
  let startX = 0;
  let endX = 0;
  let span = width;
  let output = [];
  for (let y = 0; y < height; y++) {
    [startX, span] = await findSpan(program, startX, endX, width, y);
    endX = startX + span - 1;
    output.push({ startX, span, y });
  }
  return output;
}

async function findSpan(program, previousStartX, previousEndX, maxX, y) {
  // find a span of x's that have the tractor beam affecting it on a y position
  let startX = previousStartX;
  while (startX < maxX && (await pointAffected(program, startX, y)) === 0) {
    startX++;
  }
  let endX = Math.max(previousEndX, startX);
  while (endX < maxX && (await pointAffected(program, endX, y)) === 1) {
    endX++;
  }
  const width = endX - startX;
  return [width === 0 ? previousStartX : startX, width];
}

async function affectedPoints(program, width, height) {
  const lines = await mapOut(program, width, height);
  return lines
    .map(line => {
      const startX = Math.max(line.startX, 0);
      const endX = Math.min(line.startX + line.span, width);
      return endX - startX;
    })
    .reduce((a, b) => a + b);
}

async function whereFits(program, width, height, grid = [1300, 1300]) {
  const lines = await mapOut(program, grid[0], grid[1]);
  // for every line
  // right align the rectangle
  // draw line left from top right corner
  // and down from the top left corner
  // and see if startX at that line <= the required value
  for (let y = 0; y < lines.length - height; y++) {
    const line = lines[y];
    const rightEdge = line.startX + line.span;
    const leftEdge = rightEdge - width;
    if (line.startX > leftEdge) continue;
    const bottomEdge = y + height - 1;
    const bottomLine = lines[bottomEdge];
    if (bottomLine && bottomLine.startX <= leftEdge) {
      return [leftEdge, y];
    }
  }
  return whereFits(program, width, height, [grid[0] * 2, grid[1] * 2]);
}

async function pointAffected_(program, x, y) {
  let i = 0;
  const inputs = [x, y];
  let output;
  return execute({
    program,
    doOutput: out => {
      output = out;
    },
    takeInput: () => {
      const input = inputs[i++];
      if (typeof input === "number") {
        return input;
      } else {
        throw new Error("no input, what?");
      }
    }
  }).then(() => output);
}

const pointAffected = memoizeWith((one, two, three) => JSON.stringify({ one, two, three }), pointAffected_);

module.exports = { affectedPoints, whereFits };
