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

// stdinput().then(console.log);

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
// 99: halt
//
// once done, continue to next instruction
//


function parameter(program, instruction, location, parameterOffset) {
  const mode = Math.floor(instruction / Math.pow(10, parameterOffset + 2)) % 10;
  return mode === 1 ? program[location + parameterOffset + 1] : program[program[location + parameterOffset + 1]];
}

module.exports = async function execute({
  program,
  takeInput = stdinput,
  doOutput = x => console.log("output: " + x),
  location = 0
}) {
  let newProgram, increment;
  const instruction = program[location];
  const opcode = instruction % 100;
  switch (opcode) {
    case 1:
      newProgram = [...program];
      parameter(program, instruction, location, 0);
      increment = 4;
      newProgram[program[location + 3]] = parameter(program, instruction, location, 0) + parameter(program, instruction, location, 1);
      break;
    case 2:
      newProgram = [...program];
      increment = 4;
      newProgram[program[location + 3]] = parameter(program, instruction, location, 0) * parameter(program, instruction, location, 1);
      break;
    case 3:
      newProgram = [...program];
      increment = 2;
      newProgram[program[location + 1]] = await takeInput();
      break;
    case 4:
      newProgram = program;
      increment = 2;
      doOutput(newProgram[program[location + 1]]);
      break;
    case 5:
      newProgram = program;
      if (parameter(program, instruction, location, 0)) {
        increment = parameter(program, instruction, location, 1) - location;
      } else {
        increment = 3;
      }
      break;
    case 6:
      newProgram = program;
      if (parameter(program, instruction, location, 0)) {
        increment = 3;
      } else {
        increment = parameter(program, instruction, location, 1) - location;
      }
      break;
    case 7:
      newProgram = [...program];
      increment = 4;
      if (parameter(program, instruction, location, 0) < parameter(program, instruction, location, 1)) {
        newProgram[program[location + 3]] = 1;
      } else {
        newProgram[program[location + 3]] = 0;
      }
      break;
    case 8:
      newProgram = [...program];
      increment = 4;
      if (parameter(program, instruction, location, 0) === parameter(program, instruction, location, 1)) {
        newProgram[program[location + 3]] = 1;
      } else {
        newProgram[program[location + 3]] = 0;
      }
      break;
    case 99:
      return program;
    default:
      throw new Error(`unknown opcode at location ${location}: ${opcode}`);
  }
  return execute({ program: newProgram, takeInput, doOutput, location: location + increment });
}

// log(execute([1, 0, 0, 0, 99]));
// log(execute([2,3,0,3,99]));
// log(execute([2,4,4,5,99,0]));
// log(execute([1,1,1,4,99,5,6,0,99]));
// log(input(12, 2));

// for (let i = 0; i < 100; i++) {
  // for (let j = 0; j < 100; j++) {
    // if (output(input(i, j)) === 19690720) {
      // console.log("found data", i, j);
    // }
  // }
// }



// function input(noun, verb) {
  // const raw = [1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,1,13,19,2,9,19,23,1,23,6,27,1,13,27,31,1,31,10,35,1,9,35,39,1,39,9,43,2,6,43,47,1,47,5,51,2,10,51,55,1,6,55,59,2,13,59,63,2,13,63,67,1,6,67,71,1,71,5,75,2,75,6,79,1,5,79,83,1,83,6,87,2,10,87,91,1,9,91,95,1,6,95,99,1,99,6,103,2,103,9,107,2,107,10,111,1,5,111,115,1,115,6,119,2,6,119,123,1,10,123,127,1,127,5,131,1,131,2,135,1,135,5,0,99,2,0,14,0];
  // const processed = [...raw];
  // processed[1] = noun;
  // processed[2] = verb;
  // return processed;
// }

// function output(program) {
  // return execute(program)[0];
// }

function log(x) {
  console.log(x.join(","));
}
