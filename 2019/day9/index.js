const stdinput = () => {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => readline.question("input:", input => {
    resolve(parseInt(input));
    readline.close();
  }))
};

// opcode,
// 1: add, followed by three integers -> two positions for input, one position
//   for output location
// 2: multiply, followed by three integers
// 3: take input, followed by one integer of the position of where to put the
//   input
// 4: do output, followed by one integer of the position of the value to output
// 5: jump-if-true - followed by two parameters - first parameter is whether to
//   jump, second parameter is where to jump
// 6: jump-if-false - followed by two parameters - first parameter is whether to
//   not jump, second parameter is where to jump
// 7: less than - followed by three parameters - if first parameter is less than
//   second parameter, store 1 in third parameter location.  otherwise store 0
// 8: equals - followed by three parameters - if first parameter equal to the
//   second parameter, store 1 in third parameter location.  otherwise store 0
// 9: adjust the relative base
// 99: halt
//
// once done, continue to next instruction
//


function parameter(program, instruction, location, relativeBase, parameterOffset) {
  const mode = Math.floor(instruction / Math.pow(10, parameterOffset + 2)) % 10;
  if (mode === 0) {
    return program[program[location + parameterOffset + 1]] || 0;
  } else if (mode === 1) {
    return program[location + parameterOffset + 1] || 0;
  } else if (mode === 2) {
    return program[relativeBase + program[location + parameterOffset + 1]];
  }
}

async function execute({
  program,
  takeInput = stdinput,
  doOutput = x => console.log("output: " + x),
  location = 0,
  i = 0,
  relativeBase = 0
}) {
  let increment;
  const instruction = program[location];
  const opcode = instruction % 100;
  let newRelativeBase = relativeBase;
  let newProgram = program;
  const getParam = parameter.bind(null, program, instruction, location, relativeBase);
  const store = (parameterOffset, value, debug) => {
    newProgram = [...program];
    const mode = Math.floor(instruction / Math.pow(10, parameterOffset + 2)) % 10;
    const memoryLocation = mode === 2 ? program[location + parameterOffset + 1] + relativeBase : program[location + parameterOffset + 1];
    newProgram[memoryLocation] = value;
  };
  switch (opcode) {
    case 1:
      increment = 4;
      store(2, getParam(0) + getParam(1));
      break;
    case 2:
      increment = 4;
      store(2, getParam(0) * getParam(1), true);
      break;
    case 3:
      increment = 2;
      store(0, await takeInput());
      break;
    case 4:
      increment = 2;
      await doOutput(getParam(0), newProgram);
      break;
    case 5:
      if (getParam(0)) {
        increment = getParam(1) - location;
      } else {
        increment = 3;
      }
      break;
    case 6:
      if (getParam(0)) {
        increment = 3;
      } else {
        increment = getParam(1) - location;
      }
      break;
    case 7:
      increment = 4;
      store(2, getParam(0) < getParam(1) ? 1 : 0);
      break;
    case 8:
      increment = 4;
      store(2, getParam(0) === getParam(1) ? 1 : 0);
      break;
    case 9:
      increment = 2;
      newRelativeBase = relativeBase + getParam(0);
      break;
    case 99:
      return program;
    default:
      throw new Error(`unknown opcode at location ${location}: ${opcode}`);
  }
  if (i % 1000 === 0) await delay(); // works around recursion limit in javascript
  return execute({
    program: newProgram,
    takeInput,
    doOutput,
    i: i + 1,
    relativeBase: newRelativeBase,
    location: location + increment
  });
}
const delay = () => new Promise(resolve => setTimeout(resolve, 0));

module.exports = execute;
