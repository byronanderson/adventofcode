const { without, curry } = require('ramda');

const findAcceleration = curry((subject, neighbor) => ({
  x: compare(subject.position.x, neighbor.position.x),
  y: compare(subject.position.y, neighbor.position.y),
  z: compare(subject.position.z, neighbor.position.z)
}));

function compare(pos1, pos2) {
  if (pos1 > pos2) {
    return -1;
  } else if (pos1 < pos2) {
    return 1;
  } else {
    return 0;
  }
}

function log(x) {
  console.log(x);
  return x;
}
function tick(moons) {
  return moons.map(moon => {
    const otherMoons = without([moon], moons);
    return {
      velocity: otherMoons.map(findAcceleration(moon)).reduce((vel, acceleration) => ({
        x: vel.x + acceleration.x,
        y: vel.y + acceleration.y,
        z: vel.z + acceleration.z
      }), moon.velocity),
      position: moon.position
    }
  }).map(moon => ({
    velocity: moon.velocity,
    position: {
      x: moon.position.x + moon.velocity.x,
      y: moon.position.y + moon.velocity.y,
      z: moon.position.z + moon.velocity.z
    }
  }));
}

function convert(string) {
  return string.trim().split("\n").map(
    line => {
      const match = line.trim().match(/^<x=([^,]+), y=([^,]+), z=([^,]+)>$/);
      return {
        position: {
          x: parseInt(match[1]),
          y: parseInt(match[2]),
          z: parseInt(match[3])
        },
        velocity: {
          x: 0,
          y: 0,
          z: 0
        }
      }
    }
  );
}

function simulate(input, iterations) {
  let data = input;

  for (let i = 0; i < iterations; i++) {
    data = tick(data);
  }

  return data;
}

module.exports = {
  simulate,
  convert
}
