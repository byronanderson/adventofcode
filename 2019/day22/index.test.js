const { reverseOperation } = require("./index");
test("reverseOperation", () => {
  expect(reverseOperation({ position: 3, length: 10 }, "deal into new stack")).toEqual({ position: 7, length: 10 });

  [3, 4, 5, 6, 7, 8, 9, 0, 1, 2].forEach((startPosition, endPosition) => {
    expect(reverseOperation({ position: endPosition, length: 10 }, "cut 3")).toEqual({ position: startPosition, length: 10 });
  });

  [6, 7, 8, 9, 0, 1, 2, 3, 4, 5].forEach((startPosition, endPosition) => {
    expect(reverseOperation({ position: endPosition, length: 10 }, "cut -4")).toEqual({ position: startPosition, length: 10 });
  });

  [0, 7, 4, 1, 8, 5, 2, 9, 6, 3].forEach((startPosition, endPosition) => {
    expect(reverseOperation({ position: endPosition, length: 10 }, "deal with increment 3")).toEqual({ position: startPosition, length: 10 });
  });
});
