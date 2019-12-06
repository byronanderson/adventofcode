
function structure(string) {
  const relationships = string.trim().split("\n")
  const orbits = {};
  relationships.forEach(relationship => {
    const [orbiting, entity] = relationship.split(")").map(trim);
    orbits[entity] = orbiting;
  });
  return orbits;
}

const trim = str => str.trim();

function pipe(...args) {
  return val => {
    let newVal = val;
    args.forEach(fn => {
      newVal = fn(newVal);
    })
    return newVal;
  };
}
const map = fn => list => list.map(fn);
const reduce = fn => initialVal => list => list.reduce(fn, initialVal);

const inc = x => x + 1;

function ancestors(struct, entity) {
  let subject = entity;
  const backwards = [];
  while (struct[subject]) {
    backwards.push(struct[subject]);
    subject = struct[subject];
  }
  return backwards;
}

function checksum(string) {
  const data = structure(string);
  return (
    pipe(
      Object.entries,
      map(([entity, orbiting]) => ancestors(data, orbiting)),
      reduce(
        (acc, backwards) => acc + backwards.length + 1
      )(0)
    )(data)
  );
}

function zip(a, b) {
  var rv = [];
  var idx = 0;
  var len = Math.max(a.length, b.length);
  while (idx < len) {
    rv[idx] = [a[idx], b[idx]];
    idx += 1;
  }
  return rv;
};

function transfer(string, from, to) {
  const data = structure(string);
  return pipe(
    () => zip(
      ancestors(data, from).reverse(),
      ancestors(data, to).reverse()
    ),
    zipped => {
      let i = 0;
      zipped.forEach(([x, y]) => {
        if (x === y) return;
        if (typeof x === 'string') i++;
        if (typeof y === 'string') i++;
      });
      return i;
    }
  )();
}

module.exports = { checksum, transfer };
