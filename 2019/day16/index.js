const { flatten, slice, reduce, addIndex, pipe, times, split, join, map, transpose } = require("ramda");

function log(x) {
  console.log(x);
  console.log("\n\n\n\n\n\n");
  return x;
}
function transform(value) {
  return pipe(
    split(""),
    map(x => parseInt(x)),
    input => {
      const myval = addIndex(map)((value, index) => {
        const pattern = pipe(
          value => times(() => value, index + 1),
          log,
          transpose,
          flatten,
          value => times(() => value, Math.ceil(input.length / (value.length - 1))),
          flatten,
          slice(1, input.length + 1)
        )([0, 1, 0, -1]);
        return pipe(
          transpose,
          map(([x, y]) => x * y),
          reduce((a, b) => a + b, 0),
          Math.abs,
          x => x % 10,
        )([pattern, input]);
      })(input);
      return myval;
    },
    join(""),
  )(value);
}

function fft(input, phases) {
  let value = input;
  let i = 0;
  while (i++ < phases) {
    console.log(i);
    value = transform(value);
  }
  return value;
}

module.exports = { fft };
