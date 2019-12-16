const fs = require('fs');
const path = require('path');
const { pipe, slice } = require('ramda');
const { fft } = require('./index');

function input() {
  return fs.readFileSync(path.join(__dirname, "input.txt")).toString('utf8').trim();
}

async function main() {
  //console.log(fft(input(), 100));
  console.log(fft(repeat(input(), 10000, pipe(slice(0, 8), x => parseInt(x))), 100));
}

// after a certain point, isn't it just going to be... zero???
// no, because the period of the repeat increases at the same rate as the other
// thing

function repeat(string, times) {
  let output = "";
  for (let i = 0; i < times; i++) {
    output = output.concat(string);
  }
  return output;
}

main();
