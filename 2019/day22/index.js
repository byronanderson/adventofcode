const { concat, slice, times, identity } = require("ramda");
const deckFactory = times(identity);
function shuffle(deck, operations) {
  return operations.reduce(applyOperation, deck);
}
function reverseShuffle(fakeDeck, operations) {
  return operations.reverse().reduce(reverseOperation, fakeDeck);
}

function extractNumber(string) {
  const numberString = string.match(/(-?\d+)/);
  return parseInt(numberString);
}

function cut(deck, index) {
  if (index === 0) {
    return deck;
  } else if (index > 0) {
    return concat(slice(index, Infinity, deck), slice(0, index, deck));
  } else if (index < 0) {
    return concat(
      slice(deck.length + index, deck.length, deck),
      slice(0, deck.length + index, deck)
    );
  }
}

function dealWithIncrement(deck, increment) {
  let ordering = new Array(deck.length);
  for (let i = 0; i < deck.length; i++) {
    if (ordering[(i * increment) % deck.length]) {
      throw new Error('what')
    }
    ordering[(i * increment) % deck.length] = i;
  }
  return times(i => deck[ordering[i]], deck.length);
}

function applyOperation(deck, operation) {
  if (operation === "deal into new stack") {
    return deck.reverse();
  } else if (operation.match(/^cut (-?\d+)$/)) {
    return cut(deck, extractNumber(operation));
  } else if (operation.match(/^deal with increment (-?\d+)$/)) {
    return dealWithIncrement(deck, extractNumber(operation));
  }
}

let found = false;
function reverseOperation({ position, length }, operation) {
  const value = reverseOperation_({ position, length }, operation);
  if (isNaN(value.position) && !found) {
    found = true;
    console.log(position, operation);
  }
  return value;
}
function reverseOperation_({ position, length }, operation) {
  if (operation === "deal into new stack") {
    const thing = { position: length - position - 1, length };
    return thing;
  } else if (operation.match(/^cut (-?\d+)$/)) {
    let newPosition = position + extractNumber(operation);
    newPosition = newPosition < 0 ? length + newPosition : newPosition;
    return { position: newPosition % length, length };
  } else if (operation.match(/^deal with increment (-?\d+)$/)) {
    const increment = extractNumber(operation);
    // amt * n + 1
    //nm + b
    //m = length
    //n = 1,2,3,4,...amt
    //b = position
    const n = times(x => x + 1, increment).find(mult => {
      const x = mult * length / increment + position / increment;
      const diff = x - Math.floor(x);
      // if (String(position) === "74366887868871" && diff < 0.05) console.log(diff);
      return Math.floor(x) === x;
    });
    const newPosition = position === 0 ? 0 : ((n * length + position) / increment) % length;
    // if (String(position) === "74366887868871") console.log(operation, n, increment, position, newPosition, length);
    return { position: Math.floor(newPosition), length };
  }
}

module.exports = { deckFactory, shuffle, reverseOperation, reverseShuffle };
