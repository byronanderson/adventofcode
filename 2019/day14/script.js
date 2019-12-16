const fs = require('fs');
const path = require('path');
const { parseReactions, produce } = require('./index');

function input() {
  return parseReactions(fs.readFileSync(path.join(__dirname, "input.txt")).toString('utf8').trim());
}

async function main() {
  console.log(binarySearch({
    test: num => 1000000000000 - produce(input(), num, 'FUEL') > 0
  })[0]);
}


function binarySearch({ test }) {
  const initial = 1;
  const direction = test(initial);
  let num = 1;
  let prev;
  do {
    prev = num;
    num = num * 2;
  } while (test(num) === direction);


  let done = false;
  let bounds = [1, num];
  while (bounds[1] > bounds[0] + 1) {
    const subject = Math.ceil((bounds[1] + bounds[0]) / 2)
    if (test(subject) === direction) {
      bounds = [subject, bounds[1]];
    } else {
      bounds = [bounds[0], subject];
    }
  }
  return bounds;
}

// 5194174
main();
