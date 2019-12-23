const execute = require("../day9/index.js");
const { times } = require("ramda");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
function boot({ program, sendPacket, address }) {
  let result;
  const myspy = n => {
    result = n;
  };

  let idle = false;
  const inputQueue = {
    resolves: [],
    items: [],
    enqueue: item => {
      idle = false;
      if (inputQueue.resolves.length > 0) {
        const resolve = inputQueue.resolves.shift();
        resolve(item);
      } else {
        inputQueue.items.push(item);
      }
    },
    pop: async () => {
      if (inputQueue.items.length > 0) {
        const input = inputQueue.items.shift();
        return input;
      } else {
        idle = true;
        await delay(1);
        // maybe wait for a delay?
        return -1;
      }
    }
  };

  inputQueue.enqueue(address);

  let out = [];

  const promise = delay(0).then(() =>
    execute({
      program,
      takeInput: inputQueue.pop,
      doOutput: v => {
        out.push(v);
        if (out.length === 3) {
          sendPacket({ address: out[0], x: out[1], y: out[2] });
          out = [];
        }
      }
    })
  );

  return {
    promise,
    idle: () => idle,
    queueInput: inputQueue.enqueue
  };
}

function bootAll(program, nat = () => {}) {
  const computers = times(i => boot({ program, address: i, sendPacket }), 50);
  function sendPacket({ address, x, y }) {
    if (address === 255) {
      nat({ address, x, y });
    } else {
      computers[address].queueInput(x);
      computers[address].queueInput(y);
    }
  }
  return computers;
}

module.exports = { bootAll };
