const { uniq } = require('ramda');
function shortestPath(map) {
  // if there are no keys on the map, you are done
  // make a pathing tree to help answer this question:
  //
  // find all unblocked keys
  //
  // for each unblocked key, collect the key (unlocking the door)
  // and recurse with a new map, unlocked door removed, entrance marked at your current location
  return null;
  if (keys(map).length === 0) return 0;
  return Math.min(
    ...unblockedKeys(map).map(
      key => key.distance + shortestPath(collect(key, map))
    )
  );
}

function relax(gate, map) {
  const newMap = { ...map };
  const loc = location(gate, map);
  newMap[`${loc.x},${loc.y}`] = ".";
  return newMap;
}

function collect(key, map) {
  const newMap = { ...map };
  const startingLocation = location("@", map);
  newMap[`${startingLocation.x},${startingLocation.y}`] = ".";
  Object.entries(map)
    .filter(([loc, el]) => el === key.el.toUpperCase())
    .forEach(([loc]) => {
      newMap[loc] = ".";
    });
  newMap[`${key.x},${key.y}`] = "@";
  return newMap;
}

function location(element, map) {
  const el = Object.entries(map).find(([loc, char]) => char === element);
  const [x, y] =  el[0].split(",").map(x => parseInt(x));
  return { x, y, el: element };
}

function parseMap(string) {
  const map = {};
  const lines = string.trim().split("\n");
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    const chars = line.trim().split("");
    for (let x = 0; x < chars.length; x++) {
      map[`${x},${y}`] = chars[x];
    }
  }

  // for each key on the map
  // imagining that we were at location represented by that key
  // find the distance to every other key and put it into a lookup table
  // data structure: { keys: List<Key>, distances: List<[Location, Location,
  // distance, blockages]> }
  const mykeys = keys(map);
  let distances = mykeys.reduce((distances, key) => distances.concat(findDistances(key, map)), []);
  distances = distances.concat(findDistances(location("@", map), map, distances));
  console.log(distances);
  throw new Error('this is the last part that currently makes sense');
  return { map, keys: mykeys, distances };
}

// unblockedKeys = keys.filter(destination => tryToGetTo(source, destination,
// map))
// distances for this source
function findDistances(source, map) {
  console.log("from", source);
  let effectiveMap = collect(source, map);
  let done = false;
  let i = 0;
  let filledLocations;
  let distances = [];
  let numFilled;
  const locations = [];
  while (!done) {
    let filling = true;
    let blockages = [];
    while (filling) {
      i++;
      [effectiveMap, numFilled, blockers] = fill(effectiveMap);
      blockages = uniq(blockages.concat(blockers));
      // filledLocations.forEach(({distance, ...destination}) => {
        // if (destination.el.match(/[a-z]/)) {
          // distances.push({ source, destination, distance });
        // }
      // });
      filling = numFilled > 0;
    }
    done = blockages.length === 0;
    console.log(blockages);
    if (!done) effectiveMap = relax(blockages[0], effectiveMap);
    // maybe let the filling get blocked, but then add a blockage as a thing, and unblock to get further?  but then distance is sorta unknown.  need to add as an extra bit of information on the filling-map?  like a value would be '@10', which means it is reachable, but reachable at a distance of 10 movements
  }

  console.log(effectiveMap);

  return distances; // each source/destination should only have one distance
}

//function filled(map) {
//return Object.values(map).filter(x => x === 'empty').length === 0;
//}

function parseDistance(stat) {
  const matchdata = stat.match(/\d+/);
  if (matchdata) {
    return parseInt(matchdata[0]);
  } else {
    return 0;
  }
}

// but what about when there is a cycle
// but what about when there is two paths from one spot to another?  and one is
//   a shortcut that is blocked?

function fill(map) {
  const newMap = { ...map };
  let numFilled = 0;
  let blockages = [];
  Object.entries(map)
    .filter(([loc, stat]) => stat.match(/@/))
    .forEach(([loc, stat]) => {
      const distance = parseDistance(stat) + 1;
      const [x, y] = loc.split(",").map(x => parseInt(x));
      function fill(x, y) {
        const val = newMap[`${x},${y}`];
        if (val && val.match(/[.a-z]/)) {
          // not blocked and not a wall
          newMap[`${x},${y}`] = `@${distance}`;
          // filledLocations.push({ x, y, el: val, distance });
          numFilled++
        //} else if (val && val.match(/@/)) {  // assuming this case doesn't
          //actually exist for now
          //const [item, otherdistance] = parseDistance(val);
          //if (distance < otherdistance) {
            //newMap[`${x},${y}`] = `${item}@${distance}`;
            // filledLocations.push({ x, y, el: val, distance });
            //numFilled++;
          //}
        } else if (val && val.match(/^[A-Z]$/)) {
          blockages.push(val);
        }
      }
      fill(x + 1, y);
      fill(x - 1, y);
      fill(x, y + 1);
      fill(x, y - 1);
    });
  return [newMap, numFilled, blockages];
}

const filledCount = map => Object.values(map).filter(x => x === "@").length;

const keys = map =>
  Object.entries(map)
    .filter(([loc, el]) => el.match(/[a-z]/))
    .map(keyFromEntry);

function keyFromEntry([loc, el]) {
  const [x, y] = loc.split(",").map(x => parseInt(x));
  return { x, y, el };
}

// distances lookup table so that you don't need to re-evaluate *all* distances
// always, just need to re-evaluate newly unblocked distances
// or maybe don't even bother with blockages, just note what blockages exist
// between things

function unblockedKeys(map) {
  const { x: startX, y: startY } = location("@", map);
  let filledMap = map;
  let done = false;
  let uncollectedKeys = keys(map);
  let unblockedKeys = [];
  let i = 0;
  while (!done) {
    i++;
    const [filled, amt] = fill(filledMap);
    unblockedKeys = unblockedKeys.concat(
      uncollectedKeys
        .filter(key => filled[`${key.x},${key.y}`] === "@")
        .map(key => ({ ...key, distance: i }))
    );
    uncollectedKeys = uncollectedKeys.filter(
      key => filled[`${key.x},${key.y}`] !== "@"
    );
    done = amt === 0;
    filledMap = filled;
  }

  return unblockedKeys;
}

module.exports = { parseMap, shortestPath };
