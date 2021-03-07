const fs = require('fs');
const sdk = require('../sdk');
const delay = require('delay');
const axios = require("axios");
const _ = require('underscore');
const web3Utils = require('web3-utils');
const coingeckoContractApi = "https://api.coingecko.com/api/v3/coins/ethereum/contract"

async function checkUnlistedTokens(tokenList, projectName) {
  const unlistedTokens = [];
  const tokensWithoutCoingeckoData = [];
  const supportedTokens = (await axios.get(`${process.env.DEFIPULSE_API_URL}/${process.env.DEFIPULSE_KEY}/util/supportedTokens`)).data;

  try {
    console.log(`checking ${tokenList.length} tokens for unlisted tokens`);
    for (let i = 0; i < tokenList.length; i++) {
      const token = tokenList[i];
      console.log(`${i + 1}: checking ${token.symbol}  address: ${token.address}`);
      try {
        await delay(400);

        const coinData = (await axios.get(`${coingeckoContractApi}/${token.address}`)).data
        if (coinData.contract_address && web3Utils.isAddress(coinData.contract_address)) {
          const coinIsSupported = _.find(supportedTokens, (token) => {
            if (token.contract) {
              return token.contract.toLowerCase() === coinData.contract_address.toLowerCase();
            }
          })

          if (!coinIsSupported) {
            const coinDecimals = Number(( await sdk.api.erc20.decimals(coinData.contract_address)).output);
            unlistedTokens.push({
              "coingeckoId": coinData.id,
              "symbol": coinData.symbol,
              "decimals": coinDecimals,
              "contract": coinData.contract_address.toLowerCase(),
            })
          }
        }
      }catch (e) {
        tokensWithoutCoingeckoData.push(token)
      }
    }

    fs.writeFile(`unlisted-${projectName}-tokens.json`,
      JSON.stringify(unlistedTokens,null,'\t'), 'utf8', () => {});
    fs.writeFile(`${projectName}-tokens-without-coingecko-data.json`,
      JSON.stringify(tokensWithoutCoingeckoData,null,'\t'), 'utf8', () => {});

    console.log(
      'report: ', '\n',
      `unlisted tokens: ${unlistedTokens.length}, check unlisted-${projectName}-tokens.json`,  '\n',
      `tokens without coigecko data: ${tokensWithoutCoingeckoData.length}, check ${projectName}-tokens-without-coingecko-data.json`, '\n'
    )
  }catch (e) {
    console.log(e.message);
  }
}

//(tokenList, 'matic');

module.exports = checkUnlistedTokens;
