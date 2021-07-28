const axios = require("axios")
const BigNumber = require("bignumber.js")
const { resolve } = require("path")
const fs = require("fs")
const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const [ , , filepath ] = process.argv
const absPath = resolve(process.cwd(), filepath)
const jsonOutput = fs.readFileSync(absPath, 'utf-8')
const parsedJsonOutput = JSON.parse(jsonOutput).output


async function main(){
  const coinGeckoIds = Object.values(parsedJsonOutput).map((value) => value.coingeckoId)
  let coinPricesToUSD = {}

  const resp = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
    params: {
      ids: coinGeckoIds.join(','),
      vs_currencies: 'usd'
    }
  });

  for (const [key, value] of Object.entries(resp.data)) {
    coinPricesToUSD[key] = value.usd
  }

  let records = []

  for (const [key, value] of Object.entries(parsedJsonOutput)) {
    records.push([
      key,
      value.coingeckoId,
      value.balance,
      coinPricesToUSD[value.coingeckoId]
    ])
  }

  const csvWriter = createCsvWriter({
      path: resolve(__dirname, 'harvest-output.csv'),
      header: ['id', 'coingeckoid', 'amount', 'price']
  })

  await csvWriter.writeRecords(records)
}

main()
