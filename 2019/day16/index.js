const { memoizeWith, identity, flatten, slice, reduce, addIndex, pipe, times, split, join, map, transpose } = require("ramda");

function log(x) {
  console.log(x);
  console.log("\n\n\n\n\n\n");
  return x;
}

const generatePattern = memoizeWith(identity)((index, length) => pipe(
  value => times(() => value, index + 1),
  transpose,
  flatten,
  value => times(() => value, Math.ceil(length / (value.length - 1))),
  flatten,
  slice(1, length + 1)
)([0, 1, 0, -1]));

const template = [0, 1, 0, -1];
const generatePattern2 = memoizeWith(identity)((index, length) => {
  let pattern = [];
  for (let i = 0; i < length; i++) {
    const offset = i + 1;
    const templateIndex = Math.floor(offset / (index + 1)) % template.length;
    pattern.push(template[templateIndex]);
  }
  return pattern;
});

function findDigit(pattern, input) {
  return pipe(
    transpose,
    map(([x, y]) => x * y),
    reduce((a, b) => a + b, 0),
    Math.abs,
    x => x % 10,
  )([pattern, input]);
}

function findDigit2(pattern, input) {
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    sum += input[i] * pattern[i];
  }
  return Math.abs(sum) % 10;
}

function time(fn) {
  const t1 = new Date().getTime();
  const retVal = fn();
  const t2 = new Date().getTime();
  console.log("time:", t2 - t1);
  return retVal;
}

function findDigit3(input, index, inputlength) {
  let sum = 0;
  const templatelength = template.length;
  for (let i = 0; i < inputlength; i++) {
    const offset = i + 1;
    const templateIndex = Math.floor(offset / (index + 1)) % templatelength;
    const pattern = template[templateIndex];
    if (pattern === 1) {
      sum += input[i];
    } else if (pattern === -1) {
      sum -= input[i];
    }
  }
  return Math.abs(sum) % 10;
}

//function transform1(input) {
  //const inputlength = input.length;
  //return addIndex(map)((value, index) => {
    //return time(() => {
    //const pattern = generatePattern2(index, input.length);
    //return findDigit2(pattern, input);
      //return findDigit3(input, index, inputlength);
    //});
  //})(input);
//}


function transform(input) {
  const inputlength = input.length;
  const output = [];
  const templatelength = template.length;
  let sum;
  let offset;
  let templateIndex;
  let pattern;
  for (let index = 0; index < inputlength; index++) {
    time(() => {
    sum = 0;
    for (let i = 0; i < inputlength; i++) {
      offset = i + 1;
      templateIndex = Math.floor(offset / (index + 1)) % templatelength;
      //const pattern = template[templateIndex];
      if (templateIndex === 1) {
        sum += input[i];
      } else if (templateIndex === 3) {
        sum -= input[i];
      }
    }
    });
    output.push(Math.abs(sum) % 10);
  }
  return output;
}

function fft(input, phases, messageOffset = () => 0) {
  let value = input.trim().split("").map(x => parseInt(x));
  let i = 0;
  while (i++ < phases) {
    console.log(i, value[0], new Date().getTime());
    value = transform(value);
  }
  const offset = messageOffset(value);
  return value.slice(offset, offset + 8).join("");
}

// two generators:
// one input generator,
// one pattern generator
// then the intermediates are what? intermediate generators??
// I suppose I should be splitting at the input, stringifying at the output, and
    // mutating a bunch

module.exports = { fft };
