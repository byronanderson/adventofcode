
// type command = 
// | { type: "and", identifier1: string, identifier2: string, output: string }
// | { type: "or", identifier1: string, identifier2: string, output: string }
// | { type: "lshift", identifier: string, amt: number, output: string }
// | { type: "rshift", identifier: string, amt: number, output: string }
// | { type: "not", identifier: string, output: string }
// | { type: "providevalue", amt: number, output: string }
// | { type: "providereference", identifier: string, output: string }
function command(string) {
  const [ operation, output ] = string.split(" -> ");
  let cmd;
  let match;
  if (match = operation.match(/^(\w+) AND (\w+)$/)) {
    const identifier1 = match[1];
    const identifier2 = match[2];
    cmd = { type: "and", identifier1, identifier2 };
  } else if (match = operation.match(/^(\w+) OR (\w+)$/)) {
    const identifier1 = match[1];
    const identifier2 = match[2];
    cmd = { type: "or", identifier1, identifier2 };
  } else if (match = operation.match(/^NOT (\w+)$/)) {
    const identifier = match[1];
    cmd = { type: "not", identifier };
  } else if (match = operation.match(/^(\w+) LSHIFT (\d+)$/)) {
    const identifier = match[1];
    const amt = parseInt(match[2]);
    cmd = { type: "lshift", identifier, amt };
  } else if (match = operation.match(/^(\w+) RSHIFT (\d+)$/)) {
    const identifier = match[1];
    const amt = parseInt(match[2]);
    cmd = { type: "rshift", identifier, amt };
  } else if (match = operation.match(/^(\d+)$/)) {
    const amt = parseInt(match[1]);
    cmd = { type: "providevalue", amt };
  } else if (match = operation.match(/^(\w+)$/)) {
    const identifier = match[1];
    cmd = { type: "providereference", identifier };
  } else {
    throw new Error(`could not parse ${operation}`);
  }
  return { ...cmd, output };
}

function commands(instructions) {
  return instructions.trim().split("\n").map(command);
}

const bitwiseAnd = (x, y) => x & y;
const bitwiseOr = (x, y) => x | y;
const bitwiseLShift = (x, amt) => x << amt;
const bitwiseRShift = (x, amt) => x >> amt;
const bitwiseInvert = x => {
  const string = x.toString(2);
  const chars = string.split("").reverse();
  let acc = [];
  for (let i = 0; i < 16; i++) {
    if (chars[i] === "1") {
      acc.push("0");
    } else {
      acc.push("1");
    }
  }
  return parseInt(acc.reverse().join(""), 2);
}

function findForWire(instructions, identifier, accumulator = {}) {
  if (identifier.match(/^\d+$/)) return parseInt(identifier);
  if (typeof accumulator[identifier] === 'number') return accumulator[identifier];
  const command = commands(instructions).find(command => command.output === identifier);
  if (!command) throw new Error(`could not find for ${identifier}`);
  console.log(command);
  let value;
  switch (command.type) {
    case "providevalue":
      value = command.amt;
      break;
    case "providereference":
      value = findForWire(instructions, command.identifier, accumulator);
      break;
    case "and":
      value = bitwiseAnd(
        findForWire(instructions, command.identifier1, accumulator),
        findForWire(instructions, command.identifier2, accumulator)
      );
      break;
    case "or":
      value = bitwiseOr(
        findForWire(instructions, command.identifier1, accumulator),
        findForWire(instructions, command.identifier2, accumulator)
      );
      break;
    case "lshift":
      value = bitwiseLShift(
        findForWire(instructions, command.identifier, accumulator),
        command.amt
      );
      break;
    case "rshift":
      value = bitwiseRShift(
        findForWire(instructions, command.identifier, accumulator),
        command.amt
      );
      break;
    case "not":
      value = bitwiseInvert(
        findForWire(instructions, command.identifier, accumulator)
      );
      break;
  }
  accumulator[identifier] = value;
  console.log("found for identifier", identifier, value);
  return value;
}



const fs = require('fs');
const path = require('path');

function input() {
  return fs.readFileSync(path.join(__dirname, 'input.txt')).toString('utf8');
}
function input2() {
  return fs.readFileSync(path.join(__dirname, 'input2.txt')).toString('utf8');
}

console.log(findForWire(input(), "a"));
console.log(findForWire(input2(), "a"));
const myinput = `
123 -> x
456 -> y
x AND y -> d
x OR y -> e
x LSHIFT 2 -> f
y RSHIFT 2 -> g
NOT x -> h
NOT y -> i
`;

//console.log(findForWire(myinput, "e"));
