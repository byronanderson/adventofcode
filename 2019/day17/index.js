const execute = require('../day9/index.js');

async function mapOut(program) {
  let output = [];
  return execute({
    program,
    doOutput: code => {
      output.push(String.fromCharCode(code));
    },
    takeInput: () => {
      throw new Error('takes input?');
    }
  }).then(() => {
    return output.join("");
  });
}
async function followPath(program) {
  let output = [];
  let i = 0;

  const input = 'A,B,A,C,B,C,B,C,A,C\nR,12,L,10,R,12\nL,8,R,10,R,6\nR,12,L,10,R,10,L,8\nn\n'.split("");
  let last = null;
  return execute({
    program,
    doOutput: code => {
      const string = String.fromCharCode(code)
      output.push(string);
      last = code;
      if (string === "\n") {
        process.stdout.write(output.join(""));
        output = [];
      }
    },
    takeInput: () => {
      if (output.length > 0) {
        console.log(output.join(""));
        output = [];
      }
      return input[i++].charCodeAt(0);
    }
  }).then(() => {
    console.log(output.join(""));
    console.log(last);
  });
}

function points(mapa) {
  let x = 0;
  let y = 0;
  let points = [];
  for (let char of mapa.split("")) {
    if (char === '\n') {
      y++;
      x = 0;
    } else {
      points.push({x, y, char});
      x++;
    }
  }
  return points;
}

function indexedPoints(mapa) {
  let output = {};
  for (let {x, y, char} of points(mapa)) {
    output[`${x},${y}`] = char;
  }
  return output;
}

function intersections(mapa) {
  const index = indexedPoints(mapa);
  return points(mapa).filter(point => (
    index[`${point.x},${point.y}`] === '#' &&
    index[`${point.x - 1},${point.y}`] === '#' &&
    index[`${point.x + 1},${point.y}`] === '#' &&
    index[`${point.x},${point.y - 1}`] === '#' &&
    index[`${point.x},${point.y + 1}`] === '#'
  ));

  // first: main movement routine
  // then: main 
  // A,A,B,C,B,C,B,C and then a newline
  // For example, to move forward 10 units, turn left, move forward 8 units, turn right, and finally move forward 6 units, provide the string 10,L,8,R,6 and then a newline
  // 20 ascii characters at most, each
}



async function calibrate(program) {
  const map = await mapOut(program);
  return intersections(map).map(({x, y}) => x * y).reduce((a, b) => a + b);
}

module.exports = { calibrate, mapOut, followPath };
