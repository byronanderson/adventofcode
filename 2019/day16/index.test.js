const { pipe, join, times } = require('ramda');
const { fft } = require('./index');

// const input = pipe(times(() => '03036732577212944063491565474664'), join(''))(10000);
// fft(input, 100).slice(303673, 3030673 + 8)

test('works', () => {
  time(() => {
    expect(fft('80871224585914546619083218645595', 100).slice(0, 8)).toEqual('24176176');
  });
  expect(fft('19617804207202209144916044189917', 100).slice(0, 8)).toEqual('73745418');
  expect(fft('69317163492948606335995924319873', 100).slice(0, 8)).toEqual('52432133');

  // const input = pipe(times(() => '03036732577212944063491565474664'), join(''))(10000);
  // problem is this thing is going to be so huge,
  // possible solution is to see if there is a pattern
  // expect(fft(input, 100).slice(303673, 3030673 + 8)).toEqual('84462026');
});
