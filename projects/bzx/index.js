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
    /* create array of call objects */
    let calls = iTokens.map((iToken) => ({ target: iToken[0] }));

    /* query decimal value of iTokens */
    let decimalsResponse = await sdk.api.abi.multiCall({
      calls,
      block,
      abi: iToken_ABI.find((item) => (item.name === 'decimals' && item.type === 'function')),
    });

    /* query supply amount of iTokens */
    let supplyResponse = await sdk.api.abi.multiCall({
      calls,
      block,
      abi: iToken_ABI.find((item) => (item.name === 'totalSupply' && item.type === 'function')),
    });

    /* query borrow amount of iTokens */
    let borrowResponse = await sdk.api.abi.multiCall({
      calls,
      block,
      abi: iToken_ABI.find((item) => (item.name === 'totalAssetBorrow' && item.type === 'function')),
    });


    calls = iTokens.map((iToken) => ({ target: iToken[1], params: bzxVaultAddress, }));
    /* check tokens locked in bZx vault */
    let vaultTokenResponse = await sdk.api.abi.multiCall({
      calls,
      block,
      abi: 'erc20:balanceOf',
    });

    const len = iTokens.length;
    const supply = {};
    for (let index = 0; index < len; index++) {
      const iToken = iTokens[index];
      const symbol = iToken[2].split(' ')[1].replace('ETH', 'WETH');
      const decimal = decimalsResponse.output[index].output;
      const totalSupply = new BigNumber(supplyResponse.output[index].output);
      const totalBorrow = new BigNumber(borrowResponse.output[index].output);
      const vaultTokens = new BigNumber(vaultTokenResponse.output[index].output || 0);
      const assets = (totalSupply.minus(totalBorrow)).div(Math.pow(10, decimal));
      const total = assets.plus(vaultTokens.div(Math.pow(10, decimal)));
      supply[symbol] = total.toFixed();
    }

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
    let calls = fTokens.map((fToken) => ({ target: fToken.token }));
    calls.push({ target: CHAI.token });  /* pull decimal value of CHAI token too */
    /* query decimal value of DAI, SUSD and CHAI */
    let decimalsResponse = await sdk.api.abi.multiCall({
      calls,
      block,
      abi: 'erc20:decimals',
    });

    calls = fTokens.map((fToken) => ({ target: fToken.iToken }));
    /* query supply amount of DAI and SUSD */
    let supplyResponse = await sdk.api.abi.multiCall({
      calls,
      block,
      abi: iToken_ABI.find((item) => (item.name === 'totalSupply' && item.type === 'function')),
    });

    /* query borrow amount of DAI and SUSD */
    let borrowResponse = await sdk.api.abi.multiCall({
      calls,
      block,
      abi: iToken_ABI.find((item) => (item.name === 'totalAssetBorrow' && item.type === 'function')),
    });

    calls = fTokens.map((fToken) => ({ target: fToken.token, params: bzxVaultAddress, }));
    /* check tokens locked in bZx vault */
    let vaultTokenResponse = await sdk.api.abi.multiCall({
      calls,
      block,
      abi: 'erc20:balanceOf',
    });

    const len = fTokens.length;
    for (let index = 0; index < len; index++) {
      const fToken = fTokens[index];
      const symbol = fToken.name;
      const decimal = decimalsResponse.output[index].output;
      const totalSupply = new BigNumber(supplyResponse.output[index].output);
      const totalBorrow = new BigNumber(borrowResponse.output[index].output);
      const vaultTokens = new BigNumber(vaultTokenResponse.output[index].output || 0);
      const assets = (totalSupply.minus(totalBorrow)).div(Math.pow(10, decimal));
      const total = assets.plus(vaultTokens.div(Math.pow(10, decimal)));

      if (supply[symbol]) {
        supply[symbol] = (new BigNumber(supply[symbol])).plus(total).toFixed();
      } else {
        supply[symbol] = total.toFixed();
      }

      if (symbol === 'DAI') {
        supply[symbol] = ((new BigNumber(supply[symbol])).minus(assets)).toFixed();
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
  const response = await axios('https://api.kyber.network/currencies');
  let tokenInfo = response.data.data;
  tokenInfo = tokenInfo.filter((tInfo) => !(tInfo.address === ETH_TOKEN_ADDRESS || supply[tInfo.symbol.replace('SAI', 'DAI')]));
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
      const token = tokenInfo[index];
      supply[token.symbol] = vaultBalance.div(Math.pow(10, token.decimals)).toFixed();
    }
  }

  return supply;
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
