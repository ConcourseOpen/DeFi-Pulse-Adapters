/*==================================================
  Modules
==================================================*/

const sdk = require('../../sdk');
const _ = require('underscore');
const BigNumber = require('bignumber.js');

const isWhitelistedCollateral = require('./abis/gamma/isWhitelistedCollateral.json');

/*==================================================
  Settings
==================================================*/

const START_BLOCK = 11551118;
const whitelist = "0xa5ea18ac6865f315ff5dd9f1a7fb1d41a30a6779";
const marginPool = "0x5934807cc0654d46755ebd2848840b616256c6ef";
const yvUSDC = "0x5f18c75abdae578b483e5f43f12a39cf75b973a9";
const usdc = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const sdeCRV = "0xa2761B0539374EB7AF2155f76eb09864af075250".toLowerCase();
const sdcrvWSBTC = "0x24129b935aff071c4f0554882c0d9573f4975fed".toLowerCase();
const WBTC = '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'.toLowerCase();
const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'.toLowerCase();
const wstETH = '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0'.toLowerCase();
const AAVE = '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'.toLowerCase();

const whitelistTopic = '0xafbb5b30329d7def9553a137626d5bc919fda8f5d1d1b5a64aa6123445b9415b';


/*==================================================
  TVL
==================================================*/

module.exports = async function tvl(timestamp, block) {  
  let balances = {};

    if(block >= START_BLOCK) {
      const whitelistLogs = (
        await sdk.api.util
          .getLogs({
            keys: [],
            toBlock: block,
            target: whitelist,
            fromBlock: START_BLOCK,
            topics: [whitelistTopic],
          })
      ).output;

      let collaterals = [];
      for (let log of whitelistLogs) {
        let collateral = `0x${log.topics[1].substr(26)}`.toLowerCase();
        if (collaterals.indexOf(collateral) < 0) {
          collaterals.push(collateral);
        }
      }

      for (let collateral of collaterals) {
        let isWhitelistedCollateralToken = (
          await sdk.api.abi.call({
            target: whitelist,
            abi: isWhitelistedCollateral,
            params: [collateral],
            block
          })
        ).output;

        if(isWhitelistedCollateralToken) {
          const balanceOfResult = (
            await sdk.api.abi.call({
              target: collateral,
              params: marginPool,
              abi: 'erc20:balanceOf',
              block
            })
          ).output;

          balances[collateral] = BigNumber(balances[collateral] || 0).plus(BigNumber(balanceOfResult)).toFixed();          
        }
      }

      try {
        const usdcBalance = (
          await sdk.api.abi.call({
            target: usdc,
            params: marginPool,
            abi: 'erc20:balanceOf',
            block
          })
        ).output;

        balances[usdc] = BigNumber(balances[usdc] || 0).plus(BigNumber(usdcBalance)).toFixed();
      } catch (e) {
        console.log('error getting usdc');
      }

      try {
        // Add yvUSDC as USDC to balances
        const yvUSDCBalance = (
          await sdk.api.abi.call({
            target: yvUSDC,
            params: marginPool,
            abi: 'erc20:balanceOf',
            block
          })
        ).output;

        balances[usdc] = BigNumber(balances[usdc] || 0).plus(BigNumber(yvUSDCBalance)).toFixed();
      } catch (e) {
        console.log('error getting yvusdc');
      }

      try {
        const wethBalance = (
          await sdk.api.abi.call({
            target: WETH,
            params: marginPool,
            abi: 'erc20:balanceOf',
            block
          })
        ).output;

        balances[WETH] = BigNumber(balances[WETH] || 0).plus(BigNumber(wethBalance)).toFixed();
      } catch (e) {
        console.log('error getting wethBalance');
      }


      try {
        const wstETHBalance = (
          await sdk.api.abi.call({
            target: wstETH,
            params: marginPool,
            abi: 'erc20:balanceOf',
            block
          })
        ).output;

        balances[WETH] = BigNumber(balances[WETH] || 0).plus(BigNumber(wstETHBalance)).toFixed();
      } catch (e) {
        console.log('error getting wstethBalance');
      }


      try {
        // Add sdeCRV as ETH to balances
        const sdeCRVBalance = (
          await sdk.api.abi.call({
            target: sdeCRV,
            params: marginPool,
            abi: 'erc20:balanceOf',
            block
          })
        ).output;

        balances[WETH] = BigNumber(balances[WETH] || 0).plus(BigNumber(sdeCRVBalance)).toFixed();
      } catch (e) {
        console.log('error getting sdeCRVBalance', e);
      }

      try {
        const wbtcBalance = (
          await sdk.api.abi.call({
            target: WBTC,
            params: marginPool,
            abi: 'erc20:balanceOf',
            block
          })
        ).output;

        balances[WBTC] = BigNumber(balances[WBTC] || 0).plus(BigNumber((wbtcBalance))).toFixed();
      } catch (e) {
        console.log('error getting WBTC');
      }

      try {
        // Add sdcrvWSBTC as WBTC to balances
        const sdcrvWSBTCBalance = (
          await sdk.api.abi.call({
            target: sdcrvWSBTC,
            params: marginPool,
            abi: 'erc20:balanceOf',
            block
          })
        ).output;

        balances[WBTC] = BigNumber(balances[WBTC] || 0).plus(BigNumber((sdcrvWSBTCBalance / 10**10))).toFixed();
      } catch (e) {
        console.log('error getting sdcrvWSBTC');
      }

      try {
        const aaveBalance = (
          await sdk.api.abi.call({
            target: AAVE,
            params: marginPool,
            abi: 'erc20:balanceOf',
            block
          })
        ).output;

        balances[AAVE] = BigNumber(balances[AAVE] || 0).plus(BigNumber((aaveBalance))).toFixed();
      } catch (e) {
        console.log('error getting aave');
      }
  }

  return balances;
}
