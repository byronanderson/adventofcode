
function lengthdiff(literal) {
  const innards = literal.match(/^"(.*)"$/)[1];
  const normalized = innards.replace(/\\x[0-9a-f]{2}/g, "x")
    .replace(/\\"/g, "x")
    .replace(/\\\\/g, "x");
  console.log(literal, normalized);
  return literal.length - normalized.length;
}

function lengthdiff2(literal) {
  return JSON.stringify(literal).length - literal.length;
}

const fs = require('fs');
const path = require('path');
function input() {
  return fs.readFileSync(path.join(__dirname, "input.txt")).toString('utf8');
}

console.log(
  input().trim().split("\n").reduce((acc, line) => acc + lengthdiff2(line), 0)
);
