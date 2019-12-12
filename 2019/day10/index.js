const {
  prop,
  without,
  indexBy,
  mapObjIndexed,
  values,
  groupBy,
  last,
  sortBy,
  equals,
  memoizeWith,
  uniq,
  length,
  identity,
  pipe,
  curry,
  filter,
  unnest,
  addIndex,
  trim,
  split,
  map
} = require('ramda');

const findAngle = curry((location1, location2) => {
  if (equals(location1, location2)) {
    return 0;
  } else {
    const vector = [location2[0] - location1[0], location2[1] - location1[1]];
    let angle;
    if (vector[0] === 0 && vector[1] > 0) {
      angle = Math.PI / 2;
    } else if (vector[0] === 0 && vector[1] < 0) {
      angle = -1 * Math.PI / 2;
    } else {
      angle = Math.atan(vector[1] / vector[0]);
      if (vector[0] < 0 && vector[1] < 0) angle = angle + Math.PI;
      if (vector[0] < 0 && vector[1] > 0) angle = angle + Math.PI;
    }
    return normalize(angle + Math.PI / 2);
  }
});

const findMagnitude = curry((location1, location2) => Math.sqrt(
  Math.pow(location1[0] - location2[0], 2) +
  Math.pow(location1[1] - location2[1], 2)
));

const findVector = curry((location1, location2) => ({
  angle: findAngle(location1, location2),
  magnitude: findMagnitude(location1, location2)
}));

function normalize(angle) {
  if (angle < 0) return normalize(angle + 2 * Math.PI);
  if (angle > 2 * Math.PI) return normalize(angle - 2 * Math.PI);
  return Math.floor(angle * 100000000) / 100000000;
}



const log = x => {
  console.log(x);
  return x
};
const indexedMap = addIndex(map);
const asteroidLocations = memoizeWith(identity, pipe(
  trim,
  split("\n"),
  indexedMap(
    (line, y) => pipe(
      trim,
      split(""),
      indexedMap(
        (char, x) => char === '#' ? [x, y] : null
      )
    )(line)
  ),
  unnest,
  filter(identity)
));

const visibleAsteroids = curry((mapa, subjectLocation) => pipe(
  asteroidLocations,
  map(location => ({ location, ...findVector(subjectLocation, location) })),
  groupBy(prop('angle')),
  mapObjIndexed(
    (vectors, angle) => sortBy(prop('magnitude'), vectors)[0].location
  ),
  values
)(mapa));

function bestBaseLocation(map) {
  return pipe(
    asteroidLocations,
    sortBy(loc => visibleAsteroids(map, loc).length),
    last,
    log
  )(map);
}

function makeMap(asteroids) {
  if (asteroids.length === 0) return ' ';
  let lookup = pipe(
    map(arr => arr.join('')),
    indexBy(identity)
  )(asteroids);
  const width = sortBy(prop(0), asteroids)[0];
  const height = sortBy(prop(1), asteroids)[1];
  let mapa = []
  for (let y = 0; y < height; y++) {
    let line = []
    for (let x = 0; x < width; x++) {
      line.push(lookup[`${x},${y}`] ? '#' : '.')
    }
    mapa.push(line.join(''));
  }
  return mapa.join('\n');
}

function nthDestroyed(n, mapa, baseLocation) {
  const asteroids = asteroidLocations(mapa);
  if (n > asteroids.length) throw new Error('cant get it');
  const visible = visibleAsteroids(mapa, baseLocation);
  if (n <= visible.length) {
    const angle = loc => findAngle(baseLocation, loc)
    return sortBy(angle, visible)[n - 1];
  } else {
    const newMap = makeMap(without(visible, asteroids));
    return nthDestroyed(n - visible.length, newMap, baseLocation);
  }
}

module.exports = {
  bestBaseLocation,
  visibleAsteroids,
  nthDestroyed
};
