/*==================================================
  Modules
  ==================================================*/

const sdk = require('../../sdk');
const _ = require('underscore');
const BigNumber = require('bignumber.js');

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  let balances = {};

  let allMarketsResp = await sdk.api.abi.call({
    block,
    target: '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b',
    params: [],
    abi: {
      constant: true,
      inputs: [],
      name: 'getAllMarkets',
      outputs: [
        {
          internalType: 'contract CToken[]',
          name: '',
          type: 'address[]',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
      signature: '0xb0772d0b',
    },
  });

  let getUnderlyingResp = await sdk.api.abi.multiCall({
    block,
    calls: _.map(allMarketsResp.output, (ctoken) => ({ target: ctoken })),
    abi: {
      constant: true,
      inputs: [],
      name: 'underlying',
      outputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
      signature: '0x6f307dc3',
    },
  });

  let underlyingToCToken = {};

  for (let tokenResp of getUnderlyingResp.output) {
    // if cETH, just pretend the underlying is WETH (defi pulse quirk)
    let cETH = '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5';
    let WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
    if (tokenResp.input.target == cETH) {
      underlyingToCToken[WETH] = cETH;
    } else {
      underlyingToCToken[tokenResp.output] = tokenResp.input.target;
    }
  }

  // V1 tokens locked
  let v1Locked = await sdk.api.abi.multiCall({
    block,
    calls: _.map(underlyingToCToken, (cToken, underlying) => ({
      target: underlying,
      params: '0x3FDA67f7583380E67ef93072294a7fAc882FD7E7',
    })),
    abi: 'erc20:balanceOf',
  });

  await sdk.util.sumMultiBalanceOf(balances, v1Locked);

  // V2 tokens locked
  let v2Locked = await sdk.api.abi.multiCall({
    block,
    calls: _.map(underlyingToCToken, (cToken, underlying) => ({
      target: cToken,
    })),
    abi: {
      constant: true,
      inputs: [],
      name: 'getCash',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      signature: '0x3b1d21a2',
      stateMutability: 'view',
      type: 'function',
    },
  });

  _.each(underlyingToCToken, (cToken, underlying) => {
    let getCash = _.find(v2Locked.output, (result) => {
      return result.success && result.input.target == cToken;
    });

    if (getCash) {
      balances[cToken] = BigNumber(balances[cToken] || 0)
        .plus(getCash.output)
        .toFixed();
    }
  });
  return balances;
}
/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: 'Compound',
  token: null,
  category: 'lending',
  start: 1538006400, // 09/27/2018 @ 12:00am (UTC)
  tvl,
};
