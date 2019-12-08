const md5 = require('./md5');


function findForPassword(password) {
  let done = false;
  let i = 0;
  while (!done) {
    i++;
    done = md5(password + i).match(/^000000/);
  }
  return i;
}

console.log(findForPassword('yzbqklnj'));
