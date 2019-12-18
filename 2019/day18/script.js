const fs = require('fs');
const path = require('path');
const { shortestPath, parseMap } = require('./index');

function input() {
  return parseMap(fs.readFileSync(path.join(__dirname, "input.txt")).toString('utf8').trim());
}

async function main() {
  console.log(shortestPath(parseMap(`
    #########
    #b.A.@.a#
    #########
  `)));
  console.log(shortestPath(input()));
}

main();
