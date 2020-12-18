/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const settAbi = require('./abis/Sett.json');
  const geyserAbi = require('./abis/BadgerGeyser.json');
  const _ = require('underscore');
  const BigNumber = require('bignumber.js');

/*==================================================
  Settings
  ==================================================*/

  const renCrv = "0x49849C98ae39Fff122806C06791Fa73784FB3675";
  const sbtcCrv = "0x075b1bb99792c9E1041bA13afEf80C91a1e70fB3";
  const tbtcCrv = "0x64eda51d3Ad40D56b9dFc5554E06F94e1Dd786Fd";
  const uniBadgerWbtc = "0xcd7989894bc033581532d2cd88da5db0a4b12859";

  // const setts = [
  //   "0x6dEf55d2e18486B9dDfaA075bc4e4EE0B28c1545", // native.renCrv
  //   "0xd04c48A53c111300aD41190D63681ed3dAd998eC", // native.sbtcCrv
  //   "0xb9D076fDe463dbc9f915E5392F807315Bf940334", // native.tbtcCrv
  //   "0x235c9e24D3FB2FAFd58a2E49D454Fdcd2DBf7FF1", // native.uniBadgerWbtc
  //   "0xAf5A1DECfa95BAF63E0084a35c62592B774A2A87"  // harvest.renCrv
  // ];

  const setts = {
    "0x6dEf55d2e18486B9dDfaA075bc4e4EE0B28c1545": renCrv,        // native.renCrv sett
    "0xd04c48A53c111300aD41190D63681ed3dAd998eC": sbtcCrv,       // native.sbtcCrv sett
    "0xb9D076fDe463dbc9f915E5392F807315Bf940334": tbtcCrv,       // native.tbtcCrv sett
    "0x235c9e24D3FB2FAFd58a2E49D454Fdcd2DBf7FF1": uniBadgerWbtc, // native.uniBadgerWbtc sett
    "0xAf5A1DECfa95BAF63E0084a35c62592B774A2A87": renCrv,        // harvest.renCrv sett
  };

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {

    // We calculate the TVL for badger by retrieving the total minted wrapped tokens * their
    // respective Price Per Full Share.

    let settPpfs = {};
    let balances = {};

     // Get Price Per Full Share for each sett token
    const bTokenPpfs = await sdk.api.abi.multiCall({
      block,
      calls: _.map(setts, (underlying, address) => ({
        target: address
      })),
      abi: settAbi["getPricePerFullShare"]
    });

    _.each(bTokenPpfs.output, (ppfs) => {
      if(ppfs.success) {
        const bTokenAddress = ppfs.input.target;
        settPpfs[underlyingTokenAddress[bTokenAddress]] = BigNumber(ppfs.output).div(10**18);
      }
    });

    // Get total supply of all wrapped tokens
    const bTokenSupplies = await sdk.api.abi.multiCall({
      block,
      calls: _.map(setts, (address) => ({
        target: underlyingTokenAddress[address],
        params: address
      })),
      abi: "erc20:totalSupply"
    });

    _.each(bTokenSupplies.output, (bTokenSupply) => {
      if(bTokenSupply.success) {
        const valueInToken = geyserBalance.output;
        const bTokenAddress = geyserBalance.input.target;
        balances[underlyingTokenAddress[bTokenAddress]] = BigNumber(valueInToken).multipliedBy(settPpfs[underlyingTokenAddress[bTokenAddress]])
      }
    });

    return balances;
  }


/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Template Project', // project name
    token: 'BADGER',              // null, or token symbol if project has a custom token
    category: 'assets',       // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
    start: 1607059800,        // unix timestamp (utc 0) specifying when the project began, or where live data begins
    tvl                       // tvl adapter
  }
