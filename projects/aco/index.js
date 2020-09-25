/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');
  const abi = require('./abi');
const { default: BigNumber } = require('bignumber.js');

  const START_BLOCK = 10104891;
  const FACTORY = '0x176b98ab38d1aE8fF3F30bF07f9B93E26F559C17';  
  const POOLS_FACTORY = '0x4db1d076ed0a3f2bb9b105d96edfb1671916f6ca';  
  const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';  

/*==================================================
  TVL
  ==================================================*/
  
  const getTokenAddressFromNewAcoTokenLogData = data => '0x' + data.substring(154, 194);

  const getPoolAddressFromNewAcoPoolLogData = data => '0x' + data.substring(410, 450);

  const getUnderlyingAddressFromNewAcoPoolLogData = data => '0x' + data.substring(26, 66);
  const getStrikeAssetAddressFromNewAcoPoolLogData = data => '0x' + data.substring(26, 66);

  async function tvl(timestamp, block) {
    let result = await sdk.api.util.tokenList();
    
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
      const address = getTokenAddressFromNewAcoTokenLogData(log.data);
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

    let balances = {}
    balances[ETHER_ADDRESS] = "0"

    _.each(totalCollateralResult.output, (result) => {
      if(result.success) {
        var colateralAddress = collateralAddressMap[result.input.target].toLowerCase()
        if (!balances[colateralAddress]) {
          balances[colateralAddress] = "0"
        }
        const existingBalance = new BigNumber(balances[colateralAddress]);
        balances[colateralAddress] = existingBalance.plus(new BigNumber(result.output)).toFixed()
      }
    });

    const newAcoPoolLogs = (await sdk.api.util
      .getLogs({
        keys: [],
        toBlock: block,
        target: POOLS_FACTORY,
        fromBlock: START_BLOCK,
        topic: 'NewAcoPool(address,address,bool,uint256,uint256,uint256,uint256,uint256,bool,address,address)',
      })).output;

    let acoPools = {};
    newAcoPoolLogs.forEach((log) => {
      const address = getPoolAddressFromNewAcoPoolLogData(log.data).toLowerCase();
      const underlyingAddress = getUnderlyingAddressFromNewAcoPoolLogData(log.topics[1]).toLowerCase();
      const strikeAssetAddress = getStrikeAssetAddressFromNewAcoPoolLogData(log.topics[2]).toLowerCase();
      acoPools[address] = {underlying: underlyingAddress, strikeAsset: strikeAssetAddress}
    });

    let poolCallsMap = _.map(acoPools, (poolData, poolAddress) => ({
      target: poolData.underlying,
      params: poolAddress,
    }))

    poolCallsMap = poolCallsMap.concat(_.map(acoPools, (poolData, poolAddress) => ({
      target: poolData.strikeAsset,
      params: poolAddress,
    })))

    let erc20CallsMap = poolCallsMap.filter((f) => f.target !== ETHER_ADDRESS)

    let poolBalances = await sdk.api.abi.multiCall({
      block,
      calls: erc20CallsMap,
      abi: 'erc20:balanceOf',
    });
    sdk.util.sumMultiBalanceOf(balances, poolBalances);

    let ethCallsMap = poolCallsMap.filter((f) => f.target === ETHER_ADDRESS)
    await (
      Promise.all(ethCallsMap.map(async (ethCall) => {
        const balance = (await sdk.api.eth.getBalance({target: ethCall.params, block})).output;
        balances[ETHER_ADDRESS] = BigNumber(balances[ETHER_ADDRESS]).plus(new BigNumber(balance)).toFixed();
      }))
    );

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
