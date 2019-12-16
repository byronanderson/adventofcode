const fs = require('fs');
const path = require('path');
const { mapOut, maxPathLength, render } = require('./index');

function input() {
  return fs.readFileSync(path.join(__dirname, "input.txt")).toString('utf8').trim().split(",").map(x => parseInt(x));
}

async function main() {
  //const map = await mapOut(input());
  //fs.writeFileSync(path.join(__dirname, 'foo.json'), JSON.stringify(map))
  const map = JSON.parse(fs.readFileSync(path.join(__dirname, 'foo.json')));
  render(map);
  const oxygenSystemLocation = Object.entries(map)
    .find(([location, value]) => value === 'oxygen system')[0]
  console.log(maxPathLength(map, oxygenSystemLocation));
}

main();
