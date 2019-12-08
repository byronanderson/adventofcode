const { checksum, transfer } = require('./index');

test('checksum works', () => {
  expect(checksum(`
      COM)B
      B)C
      C)D
      D)E
      E)F
      B)G
      G)H
      D)I
      E)J
      J)K
      K)L
   `)).toEqual(42);
});

test('transfer works', () => {
  expect(transfer(
    `
      COM)B
      B)C
      C)D
      D)E
      E)F
      B)G
      G)H
      D)I
      E)J
      J)K
      K)L
      K)YOU
      I)SAN
    `,
    'YOU',
    'SAN'
  )).toEqual(4);
});
