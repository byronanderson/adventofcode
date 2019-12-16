function produce(reactions, amt, resource) {
  return produce_(reactions, amt, resource).result;
}
function produce_(reactions, amount, resource, leftovers = {}) {
  let amt = amount;
  if (leftovers[resource] > 0) {
    amt = Math.max(0, amount - leftovers[resource]);
    leftovers = {
      ...leftovers,
      [resource]: leftovers[resource] - (amount - amt)
    };
  }
  if (amt === 0) return { leftovers, result: 0 };
  if (resource === 'ORE') return { leftovers, result: amt };

  const outputReaction = reactions.find(rxn => rxn.output.resource === resource);
  const factor = Math.ceil(amt / outputReaction.output.quantity);
  const leftover = factor * outputReaction.output.quantity - amt;
  leftovers = {
    ...leftovers,
    [resource]: leftover + (leftovers[resource] || 0)
  };
  const requirements = outputReaction.inputs.reduce((acc, input) => ({
    ...acc,
    [input.resource]: factor * input.quantity + (acc[input.resource] || 0)
  }), {});
  return Object.entries(requirements)
    .reduce(
      ({ leftovers, result }, [resource, quantity]) => {
        const production = produce_(reactions, quantity, resource, leftovers);
        return {
          leftovers: production.leftovers,
          result: result + production.result
        };
      },
      { leftovers, result: 0 }
    );
}

function parseReactions(string) {
  return string.trim().split("\n").map(line => {
    const [input, output] = line.trim().split(" => ");
    const inputs = input.split(", ").map(input => {
      const [stringQuantity, resource] = input.trim().split(" ");
      return { quantity: parseInt(stringQuantity), resource };
    });
    const [stringQuantity, resource] = output.split(" ");
    return { inputs, output: { quantity: parseInt(stringQuantity), resource } };
  });
}


module.exports = {
  parseReactions,
  produce
};
