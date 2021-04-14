const sdk = require('../../sdk');
const _ = require('underscore');
const BigNumber = require("bignumber.js");
const abi = require('./abi.json')


const btcTunnel = "0x258a1eb6537ae84cf612f06b557b6d53f49cc9a1"
const ltcTunnel = "0xD7D997Dd57114E1e2d64ab8c0d767A0d6b2426F0"
const obtc = "0x8064d9ae6cdf087b1bcd5bdf3531bd5d8c537a68"
const oltc = "0x07C44B5Ac257C2255AA0933112c3b75A6BFf3Cb1"
const oracle = "0xf9d6ab5faad5dEa4d15B35ECa0B72FfaE8A7104A"

const btcKey = "0x4254430000000000000000000000000000000000000000000000000000000000"
const ltcKey = "0x4c54430000000000000000000000000000000000000000000000000000000000"

async function tvl(timestamp, block) {
  let tunnelTVl, total, price;

  try {
    tunnelTVl = await sdk.api.abi.multiCall({
      block,
      calls: [{target: btcTunnel}, {target: ltcTunnel}],
      abi: abi['totalTVL']
    })
  }catch (error) {
    console.error(error);
  }

  try {
    total = await sdk.api.abi.multiCall({
      block,
      calls: [{target: obtc}, {target: oltc}],
      abi: 'erc20:totalSupply'
    })
  }catch (error) {
    console.error(error);
  }

  try {
    price = await sdk.api.abi.multiCall({
      block,
      calls: [
        {params: btcKey, target: oracle,},
        {block, params: ltcKey, target: oracle,}
      ],
      abi: abi['getPrice']
    })
  }catch (error) {
    console.error(error);
  }

    const obtcTVL = BigNumber(price.output[0].output).multipliedBy(total.output[0].output).div(10 ** 18);
    const oltcTVL = BigNumber(price.output[1].output).multipliedBy(total.output[1].output).div(10 ** 18);


  let result = obtcTVL.plus(oltcTVL).plus(tunnelTVl.output[0].output).plus(tunnelTVl.output[1].output);
  result = (result.isNaN()) ? 0: result.toFixed();

  const balances = { "0x0000000000000000000000000000000000000000": result};
  return balances
}


module.exports = {
    name: 'BoringDAO',
    token: null,
    category: 'assets',
    start: 1607745161,  // Nov-24-2018 09:45:52 PM +UTC
    tvl,
};
