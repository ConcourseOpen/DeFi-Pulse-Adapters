/**
 * @author arman
 * @since 4/15/20
 *
 */

/*==================================================
  Modules
==================================================*/

const sdk = require('../../sdk');
const axios = require('axios');
const BigNumber = require('bignumber.js');
const { fulcrum_token_registry, token_registry_ABI, iToken_ABI, CHAI, tokens: fTokens } = require('./fulcrum.js');


/*==================================================
  Settings
==================================================*/

const bzxVaultAddress = '0x8b3d70d628ebd30d4a2ea82db95ba2e906c71633';
const ETH_TOKEN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';


/*==================================================
  Private Helper Functions
==================================================*/

/**
 *
 * @param {Number} block
 * @returns {Promise<{block: *, iTokens: *}>}
 * @private
 */
const _getITokens = async (block) => {
  try {
    let result = await sdk.api.abi.call({
      block,
      target: fulcrum_token_registry,
      params: [0,200,0],
      abi: token_registry_ABI.find((item) => (item.name === 'getTokens' && item.type === 'function'))
    });

    if (result && result.output) {
      return {
        block,
        iTokens: result
          .output
          .filter((token) => {
            if (token[4] === '1') return token;
          })
      };
    }
  } catch (error) {
    console.error(`error at fetching iTokens => ${error}`);
    throw error;
  }
};

/**
 *
 * @param {Array} iTokens
 * @param {Number} block
 * @returns {Promise<{block: Number, supply: Object}>}
 * @private
 */
const _calculateITokenBalances = async ({ iTokens, block }) => {
  try {
    let calls = iTokens.map((iToken) => ({ target: iToken[0] }));

    /* query supply amount of iTokens */
    let supplyResponse = await sdk.api.abi.multiCall({
      calls,
      block,
      abi: iToken_ABI.find((item) => (item.name === 'totalAssetSupply' && item.type === 'function')),
    });

    /* query borrow amount of iTokens */
    let borrowResponse = await sdk.api.abi.multiCall({
      calls,
      block,
      abi: iToken_ABI.find((item) => (item.name === 'totalAssetBorrow' && item.type === 'function')),
    });


    calls = iTokens.map((iToken) => ({ target: iToken[1], params: bzxVaultAddress, }));
    /* pull tokens locked in bZx vault */
    let vaultTokenResponse = await sdk.api.abi.multiCall({
      calls,
      block,
      abi: 'erc20:balanceOf',
    });

    const len = iTokens.length;
    const supply = {};
    for (let index = 0; index < len; index++) {
      const iToken = iTokens[index];
      const assetAddress = iToken[1].toLowerCase();
      const totalSupply = new BigNumber(supplyResponse.output[index].output);
      const totalBorrow = new BigNumber(borrowResponse.output[index].output);
      const vaultTokens = new BigNumber(vaultTokenResponse.output[index].output || 0);
      const assets = totalSupply.minus(totalBorrow);
      const total = assets.plus(vaultTokens);
      supply[assetAddress] = total.toFixed();
    }

    /* replace SAI with DAI */
    supply['0x6b175474e89094c44da98b954eedeac495271d0f'] = supply['0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359'];
    delete supply['0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359'];

    return {
      block,
      supply,
    };
  } catch (error) {
    console.error(`error at calculating token supply => ${error}`);
    throw error;
  }
};

/**
 *
 * @param {Number} block
 * @param {Object} supply
 * @returns {Promise<{block: Number, supply: Object}>}
 * @private
 */
const _mergeDaiSUSDBalances = async ({ block, supply }) => {
  try {
    let calls = fTokens.map((fToken) => ({ target: fToken.iToken }));

    /* query supply amount of DAI and SUSD */
    let supplyResponse = await sdk.api.abi.multiCall({
      calls,
      block,
      abi: iToken_ABI.find((item) => (item.name === 'totalAssetSupply' && item.type === 'function')),
    });

    /* query borrow amount of DAI and SUSD */
    let borrowResponse = await sdk.api.abi.multiCall({
      calls,
      block,
      abi: iToken_ABI.find((item) => (item.name === 'totalAssetBorrow' && item.type === 'function')),
    });

    calls = fTokens.map((fToken) => ({ target: fToken.token, params: bzxVaultAddress, }));
    calls.push({ target: CHAI.token, params: bzxVaultAddress }); /* pull vault reserve of CHAI token too */

    /* pull tokens locked in bZx vault */
    let vaultTokenResponse = await sdk.api.abi.multiCall({
      calls,
      block,
      abi: 'erc20:balanceOf',
    });

    const len = fTokens.length;
    for (let index = 0; index < len; index++) {
      const fToken = fTokens[index];
      const assetAddress = fToken.token.toLowerCase();
      const totalSupply = new BigNumber(supplyResponse.output[index].output);
      const totalBorrow = new BigNumber(borrowResponse.output[index].output);
      const vaultTokens = new BigNumber(vaultTokenResponse.output[index].output || 0);
      const assets = totalSupply.minus(totalBorrow);
      const total = assets.plus(vaultTokens);

      if (supply[assetAddress]) {
        supply[assetAddress] = (new BigNumber(supply[assetAddress])).plus(total).toFixed();
      } else {
        supply[assetAddress] = total.toFixed();
      }

      /* when token is DAI */
      if (assetAddress === '0x6b175474e89094c44da98b954eedeac495271d0f') {
        supply[assetAddress] = ((new BigNumber(supply[assetAddress])).minus(assets)).toFixed();

        /* Handle switch to CHAI */
        if (block >= 9129436) {
          let chaiPrice = await sdk.api.abi.call({
            block,
            target: fToken.iToken,
            abi: CHAI.ABI.find((item) => (item.name === 'chaiPrice' && item.type === 'function')),
          });
          chaiPrice = chaiPrice.output;
          let chaiDecimals = await sdk.api.erc20.decimals(CHAI.token);
          chaiDecimals = chaiDecimals.output;
          let daiBalance = new BigNumber(assets * chaiPrice);
          let vaultChai = vaultTokenResponse.output.find((item) => item.input.target === CHAI.token);
          vaultChai = vaultChai.output;
          vaultChai = new BigNumber( vaultChai || 0);
          vaultChai = vaultChai * chaiPrice;
          let chaiTotal = daiBalance.plus(vaultChai);

          if (supply[assetAddress]) {
            supply[assetAddress] = (new BigNumber(supply[assetAddress])).plus(chaiTotal.div(Math.pow(10, chaiDecimals))).toFixed();
          } else {
            supply[assetAddress] = chaiTotal.toFixed();
          }
        }
      }
    }

    return {
      block,
      supply,
    };
  } catch (error) {
    console.error(`error at merging dai susd supply => ${error}`);
    throw error;
  }
};

/**
 *
 * @param {Number} block
 * @param {Object} supply
 * @returns {Promise<*>}
 * @private
 */
const _mergeKyberTokenBalances = async ({ block, supply }) => {
  try {
    const response = await axios('https://api.kyber.network/currencies');
    let tokenInfo = response.data.data;
    tokenInfo = tokenInfo.filter((tInfo) => !(tInfo.address === ETH_TOKEN_ADDRESS || tInfo.symbol === 'SAI' || supply[tInfo.address.toLowerCase()]));
    const calls = tokenInfo.map((tInfo) => ({ target: tInfo.address, params: bzxVaultAddress, }));

    let vaultTokenResponse = await sdk.api.abi.multiCall({
      calls,
      block,
      abi: 'erc20:balanceOf',
    });

    const len = tokenInfo.length;
    for (let index = 0; index < len; index++) {
      const vaultBalance = new BigNumber(vaultTokenResponse.output[index].output || 0);
      if (vaultBalance > 0) {
        supply[tokenInfo[index].address] = vaultBalance.toFixed();
      }
    }

    return supply;
  } catch (error) {
    console.error(`error at merging kyber token balances => ${error}`);
    throw error;
  }
};

/**
 *
 * @param {Object} supply
 * @returns {Promise<Object>}
 * @private
 */
const _convertToSymbols = async (supply) => {
  try {
    return (await sdk.api.util.toSymbols(supply)).output;
  } catch (error) {
    console.error(`error at symbol conversion => ${error}`);
    throw error;
  }
};


/*==================================================
  Main
==================================================*/

/**
 *
 * @param {Number} timestamp
 * @param {Number} block
 * @returns {Promise<{block: Number, supply: Object} | void>}
 */
const run = (timestamp, block) => (
  Promise
    .resolve()
    .then(_getITokens.bind(null, block))
    .then(_calculateITokenBalances)
    .then(_mergeDaiSUSDBalances)
    .then(_mergeKyberTokenBalances)
    .then(_convertToSymbols)
    .catch(console.error)
);

/*==================================================
  Exports
==================================================*/

module.exports = {
  run,
  name: 'bZx',
  token: 'BZRX',
  category: 'Lending',
  start: 1559276474,
};
