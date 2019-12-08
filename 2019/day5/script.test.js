const execute = require('./intcode');

test("input and output", async () => {
  const myspy = jest.fn()
  await execute({
    program: [3,0,4,0,99],
    takeInput: () => 30,
    doOutput: myspy
  });
  expect(myspy).toHaveBeenCalledWith(30);
  expect(myspy).toHaveBeenCalledTimes(1);
});

test("parameter modes", async () => {
  expect(await execute({
    program: [1002,4,3,4,33]
  })).toEqual([1002,4,3,4,99]);
});

async function ioexecute({ program, input }) {
  let result;
  const myspy = jest.fn(n => {
    result = n;
  });
  await execute({
    program,
    takeInput: () => input,
    doOutput: myspy
  });
  expect(myspy).toHaveBeenCalledTimes(1);
  return result;
}

test("extra operations 1", async () => {
  expect(await ioexecute({
    program: [3,9,8,9,10,9,4,9,99,-1,8],
    input: 8
  })).toEqual(1);

  expect(await ioexecute({
    program: [3,9,8,9,10,9,4,9,99,-1,8],
    input: 9
  })).toEqual(0);

  expect(await ioexecute({
    program: [3,9,7,9,10,9,4,9,99,-1,8],
    input: 8
  })).toEqual(0);

  expect(await ioexecute({
    program: [3,9,7,9,10,9,4,9,99,-1,8],
    input: 7
  })).toEqual(1);
  
  expect(await ioexecute({
    program: [3,3,1108,-1,8,3,4,3,99],
    input: 8
  })).toEqual(1);

  expect(await ioexecute({
    program: [3,3,1108,-1,8,3,4,3,99],
    input: 7
  })).toEqual(0);

  expect(await ioexecute({
    program: [3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9],
    input: 30
  })).toEqual(1);

  expect(await ioexecute({
    program: [3,3,1105,-1,9,1101,0,0,12,4,12,99,1],
    input: 0
  })).toEqual(0);

  expect(await ioexecute({
    program: [3,3,1105,-1,9,1101,0,0,12,4,12,99,1],
    input: 10
  })).toEqual(1);

  expect(await ioexecute({
    program: [3,9,8,9,10,9,4,9,99,-1,8],
    input: 8
  })).toEqual(1);

  expect(await ioexecute({
    program: [3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99],
    input: 8
  })).toEqual(1000);

  expect(await ioexecute({
    program: [3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99],
    input: 9
  })).toEqual(1001);

  expect(await ioexecute({
    program: [3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99],
    input: 6
  })).toEqual(999);
});

