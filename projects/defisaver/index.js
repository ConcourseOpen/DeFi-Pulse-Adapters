require('dotenv').config();

const {
  getAssetInfoByAddress, getAssetInfo, ilkToAsset, assetAmountInEth, assetAmountInWei,
} = require('@defisaver/tokens');

const sdk = require('../../sdk');
const { getPricesForAssetsAtTimestamp, getContractAddress, getContractMethod  } = require('./utils');

const ETH_ADDR = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const ZERO_ADDR = '0x0000000000000000000000000000000000000000';
const REP_ADDR = '0x1985365e9f78359a9b6ad760e32412f4a445e862';

const coingeckoIDs = {
  'ETH': 'ethereum',
  'WETH': 'ethereum',
  'DAI': 'dai',
  'MKR': 'maker',
  'BAT': 'basic-attention-token',
  'ZRX': '0x',
  'KNC': 'kyber-network',
  'REP': 'augur',
  'REPv2': 'augur',
  'USDC': 'usd-coin',
  'WBTC': 'wrapped-bitcoin',
  'DGD': 'digixdao',
  'USDT': 'tether',
  'SAI': 'sai',
  'COMP': 'compound-governance-token',
  'SUSD': 'nusd',
  'TUSD': 'true-usd',
  'BUSD': 'binance-usd',
  'LEND': 'ethlend',
  'LINK': 'chainlink',
  'MANA': 'decentraland',
  'SNX': 'havven',
  'ENJ': 'enjincoin',
  'REN': 'republic-protocol',
  'CRV': 'curve-dao-token',
  'YFI': 'yearn-finance',
  'PAXUSD': 'paxos-standard',
  'DPI': 'defipulse-index',
  'UNI': 'uniswap',
  'LRC': 'loopring',
  'AAVE': 'aave',
  'BAL': 'balancer',
  'GUSD': 'gemini-dollar',
};

const getMakerData = async (balances, block) => {
  try {
    const { output: makerSubs } = (await sdk.api.abi.call({
      block,
      target: getContractAddress('McdSubscriptions'),
      abi: getContractMethod('getSubscribers', 'McdSubscriptions'),
    }));

    let calls = [];
    for (const cdp of makerSubs) {
      calls = [
        ...calls,
        { target: getContractAddress('MCDSaverProxy'), params: [cdp[5]] }
      ];
    }

    const { output: cdpsDetailed } = await sdk.api.abi.multiCall({
      block,
      calls,
      abi: getContractMethod('getCdpDetailedInfo', 'MCDSaverProxy'),
    });

    makerSubs.forEach((cdp) => {
      const cdpId = cdp[5];
      let cdpDetailed = cdpsDetailed.find(i => i.input.params[0] === cdpId);
      cdpDetailed = cdpDetailed.output;
      const asset = ilkToAsset(cdpDetailed.ilk);
      const assetAddress = getAssetInfo(asset).address.toLowerCase();
      const collateral = assetAmountInEth(cdpDetailed.collateral, `MCD-${asset}`);
      balances[assetAddress] = (balances[assetAddress] || 0) + parseFloat(collateral);
    });
  } catch (error) {
    console.error('getMakerData error: ', error);
  }
};

const getCompoundData = async (balances, block, prices) => {
  try {
    const { output: compoundSubs } = (await sdk.api.abi.call({
      block,
      target: getContractAddress('CompoundSubscriptions'),
      abi: getContractMethod('getSubscribers', 'CompoundSubscriptions'),
    }));

    const { output: subsData } = (await sdk.api.abi.call({
      block,
      target: getContractAddress('CompoundLoanInfo'),
      abi: getContractMethod('getLoanDataArr', 'CompoundLoanInfo'),
      params: [compoundSubs.map((sub) => sub[0])],
    }));

    subsData.map((subData) => {
      subData[4].forEach((amount, i) => {
        const collateralAsset = subData[2][i];
        if (collateralAsset === ZERO_ADDR) return;
        const { underlyingAsset } = getAssetInfoByAddress(collateralAsset);
        const asset = getAssetInfo(underlyingAsset);
        const collUsd = assetAmountInEth(amount);
        const assetAddress = asset.address.toLowerCase();
        if (assetAddress === REP_ADDR) return;
        balances[assetAddress] = (balances[assetAddress] || 0) + (collUsd / prices[asset.symbol]);
      });
    });
  } catch (error) {
    console.error('getCompoundData error: ', error);
  }
};

const getAaveData = async (balances, block, prices) => {
  try {
    const { output: aaveSubs } = (await sdk.api.abi.call({
      block,
      target: getContractAddress('AaveSubscriptions'),
      abi: getContractMethod('getSubscribers', 'AaveSubscriptions'),
    }));

    const { output: subsData } = (await sdk.api.abi.call({
      block,
      target: getContractAddress('AaveLoanInfo'),
      abi: getContractMethod('getLoanDataArr', 'AaveLoanInfo'),
      params: [aaveSubs.map((sub) => sub[0])],
    }));

    subsData.map((subData) => {
      subData[4].forEach((amount, i) => {
        const collateralAsset = subData[2][i].toLowerCase();
        if (collateralAsset === ZERO_ADDR) return;
        const collUsd = assetAmountInEth(amount) * prices['ETH'];
        const asset = getAssetInfoByAddress(collateralAsset);
        balances[collateralAsset] = (balances[collateralAsset] || 0) + (collUsd / prices[asset.symbol]);
      });
    });
  } catch (error) {
    console.error('getAaveData error: ', error);
  }
};

async function tvl(timestamp, block) {
  const prices = await getPricesForAssetsAtTimestamp(timestamp, coingeckoIDs)

  let balances = {};

  await getMakerData(balances, block);
  await getCompoundData(balances, block, prices);
  await getAaveData(balances, block, prices);

  for (let _address in balances) {
    const isEth = _address === ETH_ADDR;
    const address = isEth ? ZERO_ADDR : _address;

    balances[address] = assetAmountInWei(balances[_address], getAssetInfoByAddress(_address).symbol)

    if (isEth) delete balances[ETH_ADDR];
  }

  return balances;
}

module.exports = {
  tvl,
  name: 'DeFi Saver',
  token: null,
  website: 'https://defisaver.com/',
  category: 'lending',
  start: 1588723200, // 06/05/2020 @ 02:00 (UTC)
  contributesTo: ['Maker', 'Compound', 'Aave'],
};
