const sdk = require('../sdk');
const fetch = require('node-fetch');

const COIN_IDS = require('./data/coinGeckoIDs.json')

async function testTVL(projectName) {
  const { tvl } = require(`../projects/${projectName}`);

  const startTime = Date.now();
  const balances = await tvl(undefined, 999999999999);
  const endTime = Date.now();

  console.log("TIME TO FETCH BALANCES", (endTime - startTime) / 1000);

  const result = await sdk.bsc.api.util.toSymbols(balances);

  console.log("RES", result.output)

  let ids = {};
  Object.keys(result.output).forEach(ticker => {
    const { id } = COIN_IDS.find(t => ticker.toLowerCase() === t.symbol.toLowerCase());

    if (id) {
      ids[ticker] = id;
    } else {
      console.log("unable to find corresponding id for ", ticker)
    }
  })

  let idQueryString = Object.entries(ids)
    .map(([ticker, id]) => id)
    .join(",");

  const pricesURL = `https://api.coingecko.com/api/v3/simple/price?ids=${idQueryString}&vs_currencies=usd`
  console.log("REQ", pricesURL)
  const pricesRes = await fetch(pricesURL)
  const prices = await pricesRes.json();

  const totalValueLocked = Object.entries(result.output)
    .reduce((acc, [ticker, tokens]) => {
      const id = ids[ticker];

      if (!id) {
        return acc;
      }

      const tokenPrice = prices[id];
      if (!tokenPrice) {
        return acc;
      }

      return acc + tokenPrice.usd * tokens;
    }, 0)

  const currencyFormat = {
    style: 'currency',
    currency: 'USD'
  }
  console.log("TVL", totalValueLocked.toLocaleString(undefined, currencyFormat));
}

if (!process.argv[2]) {
  console.log("Missing project name")
}

testTVL(process.argv[2]);