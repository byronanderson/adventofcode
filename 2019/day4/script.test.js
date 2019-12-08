const rightLength = password => password.length === 6;
const allNumbers = password => !!/^\d+$/.exec(password);
const adjacentSame = password => !!/(\d)\1/.exec(password);
const exactlyTwoAdjacentSame = password => {
  const regex = /((\d)\2)/g;
  let match;
  while ((match = regex.exec(password)) !== null) {
    if (password[match.index - 1] === match[2]) continue;
    if (password[match.index + 2] === match[2]) continue;
    return true;
  }
  return false;
}

function neverDecreases(password) {
  let compare = 0;
  for (let character of password.split("")) {
    let num = parseInt(character);
    if (num < compare) return false;
    compare = num;
  }
  return true
}

function matches(password) {
  return rightLength(password) &&
    allNumbers(password) &&
    adjacentSame(password) &&
    neverDecreases(password);
}

function matches2(password) {
  return rightLength(password) &&
    allNumbers(password) &&
    exactlyTwoAdjacentSame(password) &&
    neverDecreases(password);
}

test("works", () => {
  expect(matches("111111")).toEqual(true);
  expect(matches("123456")).toEqual(false);
  expect(matches("123440")).toEqual(false);
  expect(matches("123444")).toEqual(true);
});
test("works2", () => {
  expect(matches2("123445")).toEqual(true);
  expect(matches2("123456")).toEqual(false);
  expect(matches2("123440")).toEqual(false);
  expect(matches2("123444")).toEqual(false);
  expect(matches2("111122")).toEqual(true);
});


// cell line needed, just keep it on the project form *as well* and validate
// that you cannot remove last cell line

const range = {
  start: 108457,
  finish: 562041
};

let num = 0;
let num2 = 0;
for (let i = range.start; i < range.finish; i++) {
  if (matches(String(i))) num++;
  if (matches2(String(i))) num2++;
}

console.log("matched", num);
console.log("matched2", num2);
