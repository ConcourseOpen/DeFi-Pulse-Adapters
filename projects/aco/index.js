/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');
  const abi = require('./abi');
const { default: BigNumber } = require('bignumber.js');

  const START_BLOCK = 10104891;
  const FACTORY = '0x176b98ab38d1aE8fF3F30bF07f9B93E26F559C17';  

/*==================================================
  TVL
  ==================================================*/
  
  const getTokenAddressFromLogData = data => '0x' + data.substring(154, 194);

  async function tvl(timestamp, block) {
    const logs = (await sdk.api.util
      .getLogs({
        keys: [],
        toBlock: block,
        target: FACTORY,
        fromBlock: START_BLOCK,
        topic: 'NewAcoToken(address,address,bool,uint256,uint256,address,address)',
      })).output;

    let acoOptionsAddresses = [];
    logs.forEach((log) => {
      const address = getTokenAddressFromLogData(log.data);
      acoOptionsAddresses.push(address)
    });
    
    let collateralResult = await sdk.api.abi.multiCall({
      block,
      calls: _.map(acoOptionsAddresses, (option) => ({
        target: option
      })),
      abi: abi.collateral,
    });

    let collateralAddressMap = {}

    _.each(collateralResult.output, (result) => {
      if(result.success) {
        collateralAddressMap[result.input.target] = result.output;
      }
    });

    let totalCollateralResult = await sdk.api.abi.multiCall({
      block,
      calls: _.map(acoOptionsAddresses, (option) => ({
        target: option
      })),
      abi: abi.totalCollateral,
    });

    let balances = {"0x0000000000000000000000000000000000000000": "0"}

    _.each(totalCollateralResult.output, (result) => {
      if(result.success) {
        var colateralAddress = collateralAddressMap[result.input.target]
        if (!balances[colateralAddress]) {
          balances[colateralAddress] = "0"
        }
        const existingBalance = new BigNumber(balances[colateralAddress]);
        balances[colateralAddress] = existingBalance.plus(new BigNumber(result.output)).toFixed()
      }
    });

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'ACO',
    token: 'AUC',
    category: 'derivatives',
    start: 1590014400,   // 05/20/2020 @ 08:10:40pm (UTC)
    tvl
  }
