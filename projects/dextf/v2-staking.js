/*==================================================
 Modules
 ==================================================*/
const sdk = require('../../sdk');
const _ = require('underscore');


/*==================================================
 Vars
 ==================================================*/
const contractAddresses = [
  '0x66BEBC3c950245F05Cd1e393A55CEE56cB99b245',
  '0x42a05787584ec09dDDe46f8CE6a715c93049ee88',
];

const stackedTokens = [
  '0x5F64Ab1544D28732F0A24F4713c2C8ec0dA089f0',  // DEXTF
];

/*==================================================
  TVL
  ==================================================*/

module.exports = async function tvl(timestamp, block) {
  let calls = [];
  _.each(stackedTokens, (token) => {
    calls.push({
      target: token,
      params: contractAddresses[0]
    });
    calls.push({
      target: token,
      params: contractAddresses[1]
    });
  });

  let balanceOfResults = await sdk.api.abi.multiCall({
    block,
    calls,
    abi: 'erc20:balanceOf'
  });

  let balances = {};
  sdk.util.sumMultiBalanceOf(balances, balanceOfResults);

  return balances;
}
