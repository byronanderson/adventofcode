const fs = require('fs');
const path = require('path');
const { bestBaseLocation, visibleAsteroids, nthDestroyed } = require('./index');

// console.log(visibleAsteroids(input(), bestBaseLocation(input())).length);
console.log(nthDestroyed(199, input(), bestBaseLocation(input())));

function input() {
  return fs.readFileSync(path.join(__dirname, "input.txt")).toString('utf8');
}
