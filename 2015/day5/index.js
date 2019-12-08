//Santa needs help figuring out which strings in his text file are naughty or nice.
//
// A nice string is one with all of the following properties:
// 
//   It contains at least three vowels (aeiou only), like aei, xazegov, or aeiouaeiouaeiou.
//   It contains at least one letter that appears twice in a row, like xx, abcdde (dd), or aabbccdd (aa, bb, cc, or dd).
//   It does not contain the strings ab, cd, pq, or xy, even if they are part of one of the other requirements.


const nice = str => threeVowels(str) && repetition(str) && !naughtySubstring(str);

const threeVowels = str => str.split("").filter(chr => chr.match(/[aeiou]/)).length >= 3;
const repetition = str => !!str.match(/(.)\1/);
const naughtySubstring = str => str.match(/(ab)|(cd)|(pq)|(xy)/);


const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString('utf8');

console.log(input.trim().split("\n").filter(nice).length);

const nice2 = str => repetition2(str) && spacedRepeat(str);

const repetition2 = str => !!str.match(/(..).*\1/);
const spacedRepeat = str => !!str.match(/(.).\1/);
console.log(input.trim().split("\n").filter(nice2).length);
