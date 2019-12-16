const fs = require('fs');
const path = require('path');
const { fft } = require('./index');

function input() {
  return fs.readFileSync(path.join(__dirname, "input.txt")).toString('utf8').trim();
}

async function main() {
  // console.log(fft(input(), 100));
  // console.log(fft(input(), 100).slice();
}

main();
