/*==================================================
  Modules
  ==================================================*/

const sdk = require("../../sdk");
const _ = require('underscore');

const yVault = '0x5dbcf33d8c2e976c6b560249878e6f1491bca25c';
const yCRV = '0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8'

const markets = [{
    asset: '0x88ff54ed47402a97f6e603737f26bb9e4e6cb03d',
    pool: yVault,
  }, {
    asset: '0xa89bd606d5dadda60242e8dedeebc95c41ad8986',
    pool: yCRV,
}];

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  let balances = {};
  let calls = [];

  _.each(markets, (market) => {
    calls.push({
      target: market.pool,
      params: market.asset
    })
  });

  try {
    let balanceOfResults = await sdk.api.abi.multiCall({
      block,
      calls,
      abi: 'erc20:balanceOf'
    });

    sdk.util.sumMultiBalanceOf(balances, balanceOfResults);
  }catch (error){
    balances = {
      "0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8": 0,
      "0x5dbcf33d8c2e976c6b560249878e6f1491bca25c": 0
    }
  }

  if(_.isEmpty(balances)){
    balances = {
      "0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8": 0,
      "0x5dbcf33d8c2e976c6b560249878e6f1491bca25c": 0
    }
  }

  return balances;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: "DefiDollar",
  token: null, // null, or token symbol if project has a custom token
  category: "assets",
  start: 1598415139, // Aug-26-2020 04:12:19 AM +UTC
  tvl,
};
