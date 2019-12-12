const { simulate } = require('./index');

test('works', () => {
  expect(simulate(
    `
    <x=-1, y=0, z=2>
    <x=2, y=-10, z=-7>
    <x=4, y=-8, z=8>
    <x=3, y=5, z=-1>
    `,
    1
  )).toEqual([
    { position: { x: 2, y: -1, z: 1 }, velocity: { x: 3, y: -1, z: -1 } },
    { position: { x: 3, y: -7, z: -4 }, velocity: { x: 1, y: 3, z: 3 } },
    { position: { x: 1, y: -7, z: 5 }, velocity: { x: -3, y:  1, z:  -3 } },
    { position: { x: 2, y: 2, z: 0 }, velocity: { x:  -1, y:  -3, z:  1 } }
  ]);
  expect(simulate(
    `
    <x=-8, y=-10, z=0>
    <x=5, y=5, z=10>
    <x=2, y=-7, z=3>
    <x=9, y=-8, z=-3>
    `,
    100
  )).toEqual([
    { position: { x:  8, y:-12, z: -9 }, velocity: { x: -7, y:  3, z:  0 } },
    { position: { x: 13, y: 16, z: -3 }, velocity: { x:  3, y:-11, z: -5 } },
    { position: { x:-29, y:-11, z: -1 }, velocity: { x: -3, y:  7, z:  4 } },
    { position: { x: 16, y:-13, z: 23 }, velocity: { x:  7, y:  1, z:  1 } }
  ]);
});
