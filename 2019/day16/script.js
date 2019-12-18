const fs = require('fs');
const path = require('path');
const { pipe, slice } = require('ramda');
const { fft, fft2 } = require('./index');

function input() {
  return fs.readFileSync(path.join(__dirname, "input.txt")).toString('utf8').trim();
}

async function main() {
  //console.log(fft(input(), 100));
  console.log(JSON.stringify(fft2(input())));
}

main();
