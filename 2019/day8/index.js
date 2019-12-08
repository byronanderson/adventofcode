function layers(string, width, height) {
  const layers = [];
  const numLayers = string.length / (width * height);
  if (numLayers !== Math.floor(numLayers)) throw new Error('invalid!');
  for (let i = 0; i < numLayers; i++) {
    layers.push(string.substr(i * width * height, width * height));
  }
  return layers;
}

function render(string, width, height) {
  const image = [];
  for (const layer of layers(string, width, height).reverse()) {

    const chars = layer.split("");
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      if (char !== '2') {
        image[i] = char;
      }
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      process.stdout.write(image[y * width + x] === '1' ? "x" : " ");
    }
      process.stdout.write("\n");
  }
}

module.exports = {
  layers,
  render
};
