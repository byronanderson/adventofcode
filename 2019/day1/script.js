const fs = require('fs');
function input() {
  return fs.readFileSync('./input.txt').toString("utf8");
}

function numbers() {
  return input().trim().split("\n").map(x => parseInt(x));
}

function fuelRequirement(number) {
//  console.log(number);
  if (Number.isNaN(number)) { return 0 }
  const flat = Math.floor(number / 3) - 2;
  if (flat <= 0) return 0;
  return flat + fuelRequirement(flat);
}

function output(numbers) {
  return numbers.reduce((acc, num) => acc + fuelRequirement(num), 0);
}

console.log(output(numbers()));
