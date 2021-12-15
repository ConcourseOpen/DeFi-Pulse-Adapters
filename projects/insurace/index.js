
/*==================================================
  Modules
  ==================================================*/

const sdk = require("../../sdk");
const abi = require("./abi.json");
const _ = require('underscore');
const BigNumber = require('bignumber.js');
const axios = require("axios");

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  if( block < 12301500 ){
    return {
      "0x0000000000000000000000000000000000000000": 0
    };
  }
  const {data} = await axios.get("https://files.insurace.io/public/defipulse/pools.json");
  const pools = data.pools;

  const {output: _tvlList} = await sdk.api.abi.multiCall({
      calls: pools.map((pool) => ({
        target: pool.StakersPool,
        params: pool.PoolToken,
      })),
      abi: abi["getStakedAmountPT"],
      block,
    }
  );

  let balances = {};
  _.each(_tvlList, (element) => {
    if(element.success) {
      let address = element.input.params[0];
      if( address == "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"){
        address = "0x0000000000000000000000000000000000000000";
      }
      let balance = element.output;
      if (BigNumber(balance).toNumber() <= 0) {
        return;
      }
      balances[address] = BigNumber(balances[address] || 0).plus(balance).toFixed();
    }else{
      console.log(element);
    }
  })
  if (_.isEmpty(balances)) {
    balances = {
      '0x0000000000000000000000000000000000000000': 0,
    };
  }

  return balances;
}


/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: 'InsurAce Protocol',
  token: 'INSUR',
  category: 'Derivatives',
  start: 1619248141, // Stakers Pool creation time, Saturday, 24 April 2021 07:09:01 AM
  tvl
};
