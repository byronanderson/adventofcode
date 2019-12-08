const fs = require('fs');
const path = require('path');
function wrappingPaperRequired(l, w, h) {
  const left = l * h;
  const right = l * h;
  const top = w * l;
  const bottom = w * l;
  const front = w * h;
  const back = w * h;
  return left + right + top + bottom + front + back + Math.min(left, right, top, bottom, front, back);
}

function ribbonRequired(l, w, h) {
  const left = 2 * (l + h);
  const top = 2 * (w + l);
  const front = 2 * (w + h);
  return Math.min(left, top, front) + l * w * h;
}

const input = fs.readFileSync(path.join(__dirname,'/input.txt')).toString('utf8');
console.log(input);
const boxes = input.trim().split("\n").map(line => line.split("x").map(d => parseInt(d)))
console.log(boxes.map(box => wrappingPaperRequired(...box)).reduce((acc, paper) => acc + paper, 0));
console.log(boxes.map(box => ribbonRequired(...box)).reduce((acc, paper) => acc + paper, 0));
