
// opcode,
// 1: add, followed by three integers -> two positions for input, one position
// for output location
// 2: multiply, followed by three integers
// 99: halt
//
// once done, repeat by moving forward 4 spots
//

function execute(program, location = 0) {
  let newProgram;
  switch (program[location]) {
    case 1:
      newProgram = [...program];
      newProgram[program[location + 3]] = newProgram[program[location + 1]] + newProgram[program[location + 2]];
      break;
    case 2:
      newProgram = [...program];
      newProgram[program[location + 3]] = newProgram[program[location + 1]] * newProgram[program[location + 2]];
      break;
    case 99:
      return program;
  }
  return execute(newProgram, location + 4);
}

log(execute([1, 0, 0, 0, 99]));
log(execute([2,3,0,3,99]));
log(execute([2,4,4,5,99,0]));
log(execute([1,1,1,4,99,5,6,0,99]));
log(input(12, 2));

for (let i = 0; i < 100; i++) {
  for (let j = 0; j < 100; j++) {
    if (output(input(i, j)) === 19690720) {
      console.log("found data", i, j);
    }
  }
}



function input(noun, verb) {
  const raw = [1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,1,13,19,2,9,19,23,1,23,6,27,1,13,27,31,1,31,10,35,1,9,35,39,1,39,9,43,2,6,43,47,1,47,5,51,2,10,51,55,1,6,55,59,2,13,59,63,2,13,63,67,1,6,67,71,1,71,5,75,2,75,6,79,1,5,79,83,1,83,6,87,2,10,87,91,1,9,91,95,1,6,95,99,1,99,6,103,2,103,9,107,2,107,10,111,1,5,111,115,1,115,6,119,2,6,119,123,1,10,123,127,1,127,5,131,1,131,2,135,1,135,5,0,99,2,0,14,0];
  const processed = [...raw];
  processed[1] = noun;
  processed[2] = verb;
  return processed;
}

function output(program) {
  return execute(program)[0];
}

function log(x) {
  console.log(x.join(","));
}
