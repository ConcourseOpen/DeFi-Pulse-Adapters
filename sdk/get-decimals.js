const sdk = require('../sdk');
const fs = require('fs');

const BSC_TOKENS = require("./data/bscTokenLists.json");
const ETH_TOKENS = require("./data/ethTokenLists.json");

async function getDecimals() {
  const bscDecimals = await Promise.all(
    BSC_TOKENS.map(({ contract }) => sdk.bsc.api.bep20.decimals(contract))
  )

  const bscTokensWithDecimals = BSC_TOKENS.map(({ symbol, contract }, i) => ({
    symbol,
    contract,
    decimals: parseInt(bscDecimals[i].output.output)
  }))

  fs.writeFileSync('./data/bscTokenLists.json', JSON.stringify(bscTokensWithDecimals, null, 2))
}

getDecimals();