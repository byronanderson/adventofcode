const fs = require('fs');
const path = require('path');
const { zip } = require('ramda');
const { simulate, convert } = require('./index');

function input() {
  return fs.readFileSync(path.join(__dirname, "input.txt")).toString('utf8');
}

const potentialEnergy = ({ position: { x, y, z } }) => Math.abs(x) + Math.abs(y) + Math.abs(z);
const kineticEnergy = ({ velocity: { x, y, z } }) => Math.abs(x) + Math.abs(y) + Math.abs(z);
const energy = moon => potentialEnergy(moon) * kineticEnergy(moon);

async function main() {
  const output = simulate(convert(input()), 1000);
  const total = output.map(energy).reduce((x, y) => x + y, 0);
  console.log("total", total);

  let done = false;
  let system = convert(input());
  const start = system;

  let i = 0;
  const cycles = [null, null, null];
  while (!done) {
    system = simulate(system, 1);
    i++;
    if (equivalent(start, system, 'x')) cycles[0] = cycles[0] || i;
    if (equivalent(start, system, 'y')) cycles[1] = cycles[1] || i;
    if (equivalent(start, system, 'z')) cycles[2] = cycles[2] || i;
    if (i % 10000 === 0) console.log(i);
    done = cycles[0] && cycles[1] && cycles[2];
  }
  const period = lcm(cycles);
  console.log("found", period);
}


function leastCommonMultiple(a, b) {
  return ((a === 0) || (b === 0)) ? 0 : Math.abs(a * b) / gcd(a, b);
}

let gcd = (num1, num2) => {
  while(num1 != num2){
    if(num1 > num2){
      num1 = num1 - num2;
    }else{
      num2 = num2 - num1;
    }
  }

  return num2;
}

function lcm(list) {
  return list.reduce(leastCommonMultiple);
}

function equivalent(system1, system2, dimension) {
  for (let [time1, time2] of zip(system1, system2)) {
    const equivalent = time1.position[dimension] === time2.position[dimension] && time1.velocity[dimension] === time2.velocity[dimension]
    if (!equivalent) return false;
  }
  console.log('dimension', dimension);
  return true;
}
main();
