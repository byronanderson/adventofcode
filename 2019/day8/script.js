const fs = require('fs');
const path = require('path');
const { layers, render } = require('./index');
const { curry, sortBy } = require('ramda');

function input() {
  return fs.readFileSync(path.join(__dirname, "input.txt")).toString('utf8').trim();
}
const l = layers(input(), 25, 6);

const countChar = curry((char, str) => str.split("").filter(c => c === char).length);
const layer = sortBy(
  countChar('0'),
  l
)[0];



console.log(countChar('0', layer));
console.log("layer", layer);

console.log(countChar('1', layer) * countChar('2', layer));


render(input(), 25, 6);
