// This terrible hack is necessary beacuse DeFi Pulse doesn't actually show us the
// end TVL result, which we need in order to properly test our adapter!
//
// First, run the DeFi Pulse adapter test:
//
//    npm run test -- --project=harvest
//
// Then, run this script, passing it the filename of the output file from
// the previous script:
//
//   node projects/harvest/test-tvl-from-output.js output/harvest/tvl/2021-06-06_20-00-00.json

const axios = require("axios")
const BigNumber = require("bignumber.js")
const { resolve } = require("path")
const fs = require("fs")
const [ , , filepath ] = process.argv
const absPath = resolve(process.cwd(), filepath)
const jsonOutput = fs.readFileSync(absPath, 'utf-8')
const parsedJsonOutput = JSON.parse(jsonOutput).output

// https://stackoverflow.com/a/2901298
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

console.log(parsedJsonOutput)


const main = async () => {
  const coinGeckoIds = Object.values(parsedJsonOutput).map((value) => value.coingeckoId)
  const coinPricesToUSD = {}
  let tvl = BigNumber(0);

  const resp = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
    params: {
      ids: coinGeckoIds.join(','),
      vs_currencies: 'usd'
    }
  });

  for (const [key, value] of Object.entries(resp.data)) {
    coinPricesToUSD[key] = value.usd
  }

  Object.values(parsedJsonOutput).forEach((value) => {
    const price = coinPricesToUSD[value.coingeckoId]

    if (price) {
      tvl = BigNumber.sum(tvl, new BigNumber(value.balance).multipliedBy(new BigNumber(price)));
    }
  });

  console.log(`Total value locked: ${numberWithCommas(tvl.toFixed(2))}`)
}
main()
