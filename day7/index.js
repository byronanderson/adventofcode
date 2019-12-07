const execute = require('../day5/intcode.js');

async function amplify({ program, setting, input }) {
  let result;
  const myspy = n => {
    console.log("output", n);
    result = n;
  };
  let inputIndex = 0;
  let inputs = [setting, input];
  // these inputs are wrong, this needs to be stateful execution now...
  await execute({
    program,
    takeInput: () => {
      const val = inputs[inputIndex];
      inputIndex++;
      return val;
    },
    doOutput: myspy
  });
  return result;
}

async function runSettings(program, settings) {
  let input = 0;
  for (let setting of settings) {
    input = await amplify({
      program, 
      setting,
      input
    });
  }
  return input;
}

const uniqLength = list => new Set(list).size;

async function findMax(program) {
  let max = 0;
  for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
  for (let k = 0; k < 5; k++) {
  for (let l = 0; l < 5; l++) {
  for (let m = 0; m < 5; m++) {
    if (uniqLength([i, j, k, l, m]) !== 5) continue;
    const output = await runSettings(program, [i, j, k, l, m]);
    if (output > max) {
      console.log("new max", [i, j, k, l, m], output);
      max = output;
    }
  }
  }
  }
  }
  }
  console.log("max", max);
}
//async function findMax2(program) {
//let max = 0;
//for (let i = 5; i < 10; i++) {
//for (let j = 5; j < 10; j++) {
//for (let k = 5; k < 10; k++) {
//for (let l = 5; l < 10; l++) {
//for (let m = 5; m < 10; m++) {
//  if (uniqLength([i, j, k, l, m]) !== 5) continue;
//  const output = await runSettings(program, [i, j, k, l, m]);
//    console.log("output", output);
//  if (output > max) {
//    console.log("new max", [i, j, k, l, m], output);
//    max = output;
//  }
//}
//}
//}
//}
//}
//console.log("max", max);
//}

findMax2([3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5]);

// findMax([3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0]);

// findMax(input());

function input() {
  return [
    3,8,1001,8,10,8,105,1,0,0,21,42,51,76,101,118,199,280,361,442,99999,3,9,101,5,9,9,102,2,9,9,1001,9,4,9,102,2,9,9,4,9,99,3,9,1002,9,3,9,4,9,99,3,9,1002,9,4,9,1001,9,3,9,1002,9,5,9,101,3,9,9,1002,9,2,9,4,9,99,3,9,101,4,9,9,1002,9,2,9,1001,9,3,9,1002,9,3,9,101,4,9,9,4,9,99,3,9,101,3,9,9,1002,9,3,9,101,2,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,99
  ];
}

