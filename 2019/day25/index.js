const execute = require("../day9");

const stdinput = () => {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => readline.question("input:", input => {
    console.log(JSON.stringify(input));
    resolve(input);
    readline.close();
  }))
};

async function play(program, input = "") {
  let output = [];
  let i = 0;

  let last = null;
  let failed = false;
  return execute({
    program,
    doOutput: code => {
      const string = String.fromCharCode(code);
      output.push(string);
      if (string === "\n") {
        if (output.join("").includes("Didn't")) {
          failed = true;
        }
        console.log(output.join(""));
        output = [];
      }
    },
    takeInput: async () => {
      if (output.length > 0) {
        console.log(output.join(""));
        output = [];
      }
      if (input[i]) {
        return input[i++].charCodeAt(0);
      } else {
        input = await stdinput() + "\n";
        i = 0;
        return input[i++].charCodeAt(0);
      }
    }
  });
}

module.exports = { play };
