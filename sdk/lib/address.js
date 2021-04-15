const BSC_TOKENS = require("../data/bscTokenLists.json");
const ETH_TOKENS = require("../data/ethTokenLists.json");

function mapAddressToTokenSymbol(tokenList, address) {
  const token = tokenList.find(t => t.contract.toLowerCase() === address.toLowerCase());

  return token && token.symbol;
}

function toSymbols(output) {
  const result = {};

  Object.keys(output).forEach(address => {
    const symbol =
      mapAddressToTokenSymbol(BSC_TOKENS, address) || mapAddressToTokenSymbol(ETH_TOKENS, address) || address;

    if (result[symbol]) {
      result[symbol] += output[address];
    } else {
      result[symbol] = output[address];
    }
  });

  return result;
}

module.exports = { mapAddressToTokenSymbol, toSymbols };
