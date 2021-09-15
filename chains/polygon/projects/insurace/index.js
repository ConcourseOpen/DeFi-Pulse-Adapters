
/*==================================================
  Modules
  ==================================================*/

  const sdk = require("../../../../sdk");
  const abi = require("./abi.json");
  const _ = require('underscore');
  const BigNumber = require('bignumber.js');
  const axios = require("axios");

  var fs = require('fs');


/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    if( block < 18692990 ){
        return {
            "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270": 0
        };
    }
    const {data} = await axios.get("https://files.insurace.io/public/defipulse/polygonpools.json");
    const pools = data.pools;
    
    const {output: _tvlList} = await sdk.api.abi.multiCall({
        calls: pools.map((pool) => ({
            target: pool.StakersPool,
            params: pool.PoolToken,
        })),
        abi: abi["getStakedAmountPT"],
        block,
        chain: 'polygon'
      }
    );
    const balances = {};
    _.each(_tvlList, (element) => {
        if(element.success) {
            let address = element.input.params[0];
            if( address == "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"){
                address = "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270";
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
    return balances;
  }


/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'InsurAce Protocol',
    token: 'INSUR',
    chain: 'polygon',
    category: 'derivatives',
    start: 18692990, // Stakers Pool creation time, Friday, 03 September 2021 07:21:14 AM
    tvl
  }