function shortestPath(map) {
  // if there are no keys on the map, you are done
  // make a pathing tree to help answer this question:
  //
  // find all unblocked keys
  //
  // for each unblocked key, collect the key (unlocking the door)
  // and recurse with a new map, unlocked door removed, entrance marked at your current location
  if (keys(map).length === 0) return 0;
  return Math.min(
    ...unblockedKeys(map).map(
      key => key.distance + shortestPath(collect(key, map))
    )
  );
}

function collect(key, map) {
  const newMap = { ...map };
  const startingLocation = location("@", map);
  newMap[`${startingLocation[0]},${startingLocation[1]}`] = ".";
  newMap[`${key.x},${key.y}`] = "@";
  Object.entries(map)
    .filter(([loc, el]) => el === key.el.toUpperCase())
    .forEach(([loc]) => {
      newMap[loc] = ".";
    });
  return newMap;
}

function location(element, map) {
  const el = Object.entries(map).find(([loc, char]) => char === element);
  return el[0].split(",").map(x => parseInt(x));
}

function parseMap(map) {
  const output = {};
  const lines = map.trim().split("\n");
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    const chars = line.trim().split("");
    for (let x = 0; x < chars.length; x++) {
      output[`${x},${y}`] = chars[x];
    }
  }
  return output;
}

//function filled(map) {
//return Object.values(map).filter(x => x === 'empty').length === 0;
//}

function fill(map) {
  const newMap = { ...map };
  let numFilled = 0;
  Object.entries(map)
    .filter(([loc, stat]) => stat === "@")
    .forEach(([loc]) => {
      const [x, y] = loc.split(",").map(x => parseInt(x));
      function fill(x, y) {
        const val = newMap[`${x},${y}`];
        //console.log("checking", val);
        if (val && val.match(/[.a-z]/)) {
          //console.log("filling", x, y);
          // not blocked and not a wall
          newMap[`${x},${y}`] = "@";
          numFilled++;
        }
      }
      fill(x + 1, y);
      fill(x - 1, y);
      fill(x, y + 1);
      fill(x, y - 1);
    });
  return [newMap, numFilled];
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
  const [startX, startY] = location("@", map);
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
