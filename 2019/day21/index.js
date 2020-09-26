const execute = require('../day9/index.js');

async function programSpringbot(intcode, springscript, silent = false) {
  let output = [];
  let i = 0;
  const log = silent ? () => {} : console.log;
  const write = silent ? () => {} : process.stdout.write.bind(process.stdout);

  const input = springscript.join("\n").concat("\n");
  let last = null;
  let failed = false;
  return execute({
    program: intcode,
    doOutput: code => {
      const string = String.fromCharCode(code)
      output.push(string);
      last = code;
      if (string === "\n") {
        if (output.join("").includes("Didn't")) { failed = true }
        write(output.join(""));
        output = [];
      }
    },
    takeInput: () => {
      if (output.length > 0) {
        log(output.join(""));
        output = [];
      }

      return input[i++].charCodeAt(0);
    }
  }).then(() => {
    log(output.join(""));
    log(last);
    return !failed;
  });
}

// if there is ground 3 in front of you

module.exports = { programSpringbot };
