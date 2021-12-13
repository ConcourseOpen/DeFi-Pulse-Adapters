/*==================================================
  Modules
  ==================================================*/

const sdk = require("../../sdk");
const _ = require("underscore");
_.flatMap = _.compose(_.flatten, _.map);
const BN = require('bignumber.js');

const abi = require("./abi.json");
const { object } = require("underscore");

/*==================================================
  Constants
  ==================================================*/

const CurveRegistryStart = 11218787;
const factoryStartBlock = 11942404;
const CurveAddressProvider = "0x0000000022d53366457f9d5e68ec105046fc4383";
const etherAddress = "0x0000000000000000000000000000000000000000";
const curveEtherAddress = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
const factoryAddress = "0x0959158b6040D32d04c301A72CBFD6b39E21c9AE";

const curvePools = [
  "0xeDf54bC005bc2Df0Cc6A675596e843D28b16A966",
  "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
  "0x79a8C46DeA5aDa233ABaFFD40F3A0A2B1e5A4F27",
  "0xA2B47E3D5c44877cca798226B7B8118F9BFb7A56",
  "0x4f062658EaAF2C1ccf8C8e36D6824CDf41167956",
  "0x4CA9b3063Ec5866A4B82E437059D2C43d1be596F",
  "0x3eF6A01A0f81D6046290f3e2A8c5b843e738E604",
  "0xE7a24EF0C5e95Ffb0f6684b813A78F2a3AD7D171",
  "0x8474DdbE98F5aA3179B3B3F5942D724aFcdec9f6",
  "0x06364f10B501e868329afBc005b3492902d6C763",
  "0x93054188d876f558f4a66B2EF1d97d16eDf0895B",
  "0xC18cC39da8b11dA8c3541C598eE022258F9744da",
  "0x7fC77b5c7614E1533320Ea6DDc2Eb61fa00A9714",
  "0xA5407eAE9Ba41422680e2e00537571bcC53efBfD",
  "0xC25099792E9349C7DD09759744ea681C7de2cb66",
  "0x3E01dD8a5E1fb3481F0F589056b428Fc308AF0Fb",
  "0x0f9cb53Ebe405d49A0bbdBD291A65Ff571bC83e1",
  "0x52EA46506B9CC5Ef470C5bf89f17Dc28bB35D85C",
  "0x45F783CCE6B7FF23B2ab2D70e416cdb7D6055f51",
  "0x8038C01A0390a8c547446a0b2c18fc9aEFEcc10c",
  "0x071c661B4DeefB59E2a3DdB20Db036821eeE8F4b",
  "0xd81dA8D904b52208541Bade1bD6595D8a251F8dd",
  "0x7F55DDe206dbAD629C080068923b36fe9D6bDBeF",
  "0x890f4e345B1dAED0367A877a1612f86A1f86985f",
  "0x0Ce6a5fF5217e38315f87032CF90686C96627CAA",
  "0xc5424B857f758E906013F3555Dad202e4bdB4567",
  "0xDeBF20617708857ebe4F679508E7b7863a8A8EeE",
];

const yTokens = [
  {
    contract: "0xf61718057901f84c4eec4339ef8f0d86d2b45600",  // ySUSD
    underlying: "0x57ab1ec28d129707052df4df418d58a2d46d5f51", // SUSD
  },
  {
    contract: "0xe6354ed5bc4b393a5aad09f21c46e101e692d447",  // yUSDT
    underlying: "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
  },
  {
    contract: "0xc2cb1040220768554cf699b0d863a3cd4324ce32", // yDAI
    underlying: "0x6b175474e89094c44da98b954eedeac495271d0f", // DAI
  },
  {
    contract: "0x83f798e925bcd4017eb265844fddabb448f1707d",  // yUSDT
    underlying: "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
  },
  {
    contract: "0x1be5d71f2da660bfdee8012ddc58d024448a0a59",  // ycUSDT
    underlying: "0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9", // cUSDT
  },
  {
    contract: "0x73a052500105205d34daf004eab301916da8190f",  // yTUSD
    underlying: "0x0000000000085d4780b73119b644ae5ecd22b376", // TUSD
  },
  {
    contract: "0x99d1fa417f94dcd62bfe781a1213c092a47041bc",  // ycDAI
    underlying: "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643", // cDAI
  },
  {
    contract: "0xd6ad7a6750a7593e092a9b218d66c0a814a3436e",  // yUSDC
    underlying: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
  },
  {
    contract: "0x9777d7e2b60bb01759d0e2f8be2095df444cb07e",  // ycUSDC
    underlying: "0x39aa39c021dfbae8fac545936693ac917d5e7563", // cUSDC
  },
];

/**
 *
 * @param {Number} block
 * @param {String} registryAddress
 * @param {Boolean} registryStart
 * @returns {Promise<number>}
 * @private
 */
const _getPoolCount = async (block, registryAddress, registryStart) => {
  return (
    registryStart
      ? (
        await sdk.api.abi.call({
          block,
          target: registryAddress,
          abi: abi["pool_count"],
        })
      ).output
      : curvePools.length
  )
};

/**
 *
 * @param {Number} block
 * @param {Number} poolCount
 * @param {String} registryAddress
 * @param {Boolean} registryStart
 * @returns {Promise<Array>}
 * @private
 */
const _getPoolAddresses = async (block, poolCount, registryAddress, registryStart) => {
  const poolAddresses = [];
  const chunks = sdk.util.splitArrIntoChunks([...Array(Number(poolCount)).keys()], 20);

  while (chunks.length) {
    const chunk = chunks.shift();
    const poolListCalls = chunk.map((index) => {
      return new Promise(async (resolve) => {
        try {
          let poolAddress = registryStart ? (
            await sdk.api.abi.call({
              block,
              target: registryAddress,
              abi: abi["pool_list"],
              params: index,
            })
          ).output : curvePools[index];

          poolAddresses.push(poolAddress.toLowerCase());
        } catch (error) {
          console.log(error);
        }

        return resolve();
      });
    });

    await Promise.all(poolListCalls);
    console.log(`Fetched ${poolAddresses.length} pool addresses!`);
  }

  return poolAddresses;
};

/**
 *
 * @param {Number} block
 * @param {Array} poolAddresses
 * @param {String} registryAddress
 * @param {String} method
 * @returns {Promise<void>}
 * @private
 */
const _getTokenList = async (block, poolAddresses, registryAddress, method) => {
  const tokenList = {};
  const chunks = sdk.util.splitArrIntoChunks(Array.from(poolAddresses), 20);

  while (chunks.length) {
    const chunk = chunks.shift();
    const tokenListPromises = chunk.map((poolAddress) => {
      return new Promise(async (resolve) => {
        try {
          tokenList[poolAddress] = (await sdk.api.abi.call({
            block,
            target: registryAddress,
            abi: abi[method],
            params: poolAddress
          })).output;
        } catch (error) {
          console.log(error);
        }

        resolve();
      })
    });

    await Promise.all(tokenListPromises);
    console.log(`Fetched token list for ${Object.keys(tokenList).length} pool addresses!`);
  }

  return tokenList;
};

/**
 *
 * @param {Number} block
 * @param {Array} poolAddresses
 * @param {String} registryAddress
 * @param {String} method
 * @returns {Promise<void>}
 * @private
 */
const _getBalanceList = async (block, poolAddresses, registryAddress, method) => {
  const balanceList = {};
  const chunks = sdk.util.splitArrIntoChunks(Array.from(poolAddresses), 20);

  while (chunks.length) {
    const chunk = chunks.shift();
    const balanceListPromises = chunk.map((poolAddress) => {
      return new Promise(async (resolve) => {
        try {
          balanceList[poolAddress] = (await sdk.api.abi.call({
            block,
            target: registryAddress,
            abi: abi[method],
            params: poolAddress
          })).output;
        } catch (error) {
          console.log(error);
        }

        resolve();
      })
    });

    await Promise.all(balanceListPromises);
    console.log(`Fetched balance list for ${Object.keys(balanceList).length} pool addresses!`);
  }

  return balanceList;
};

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  let balances = {};
  let registryStart = block > CurveRegistryStart;
  let factoryStart = block > factoryStartBlock;

  balances[curveEtherAddress] = 0;
  balances["0x6b175474e89094c44da98b954eedeac495271d0f"] = 0;
  balances["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] = 0;
  let CurveRegistryAddress;

  if (registryStart) {
    CurveRegistryAddress = (await sdk.api.abi.call({
      block,
      target: CurveAddressProvider,
      abi: abi["get_registry"]
    })).output
  }

  let registryPoolCount = await _getPoolCount(block, CurveRegistryAddress, registryStart);
  const registryPoolAddresses = await _getPoolAddresses(block, registryPoolCount, CurveRegistryAddress, registryStart);
  const registryTokenList = await _getTokenList(block, registryPoolAddresses, CurveRegistryAddress, 'get_coins');
  const registryBalanceList = await _getBalanceList(block, registryPoolAddresses, CurveRegistryAddress, 'get_balances');

  registryPoolAddresses.forEach((poolAddress) => {
    const tokens = registryTokenList[poolAddress];
    const tokenBalances = registryBalanceList[poolAddress];
    const len = tokens.length;

    for (let idx = 0; idx < len; idx++) {
      let token = tokens[idx].toLowerCase();
      let balance = tokenBalances[idx];

      if (token !== etherAddress) {
        balances[token] = new BN(balances[token] || 0).plus(balance);
      }
    }
  });

  if (factoryStart) {
    let factoryPoolCount = await _getPoolCount(block, factoryAddress, factoryStart);
    let factoryPoolAddresses = await _getPoolAddresses(block, factoryPoolCount, factoryAddress, factoryStart);
    factoryPoolAddresses = factoryPoolAddresses.filter((factoryPoolAddress) => !registryPoolAddresses.find((registryPoolAddress) => factoryPoolAddress === registryPoolAddress));
    const factoryTokenList = await _getTokenList(block, factoryPoolAddresses, factoryAddress, 'get_coinsf');
    const factoryBalanceList = await _getBalanceList(block, factoryPoolAddresses, factoryAddress, 'get_balancesf');

    factoryPoolAddresses.forEach((poolAddress) => {
      const tokens = factoryTokenList[poolAddress];
      const tokenBalances = factoryBalanceList[poolAddress];
      const len = tokens.length;

      for (let idx = 0; idx < len; idx++) {
        let token = tokens[idx].toLowerCase();
        let balance = tokenBalances[idx];

        if (token !== etherAddress) {
          balances[token] = new BN(balances[token] || 0).plus(balance);
        }
      }
    });
  }

  delete balances['0x6c3f90f043a72fa612cbac8115ee7e52bde6e490'];
  delete balances['0x075b1bb99792c9e1041ba13afef80c91a1e70fb3'];
  delete balances['0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8'];

  // Count y tokens as their underlying asset, ie ycDAI = cDAI
  Object
    .keys(balances)
    .forEach((contract) => {
      const yToken = yTokens.find((token) => token.contract.toLowerCase() === contract);

      if (yToken) {
        const underLyingContract = yToken.underlying.toLowerCase();
        balances[underLyingContract] = new BN(balances[underLyingContract] || 0).plus(balances[contract]);

        delete balances[contract];
      }
    });

  return balances;
}

/**async function rates(timestamp, block) {
    let yTokens = [
      //yTokens curve.fi/y
      '0x16de59092dAE5CcF4A1E6439D611fd0653f0Bd01',
      '0xd6aD7a6750A7593E092a9B218d66C0A814a3436e',
      '0x83f798e925BcD4017Eb265844FDDAbb448f1707D',
      '0x73a052500105205d34Daf004eAb301916DA8190f',

      //yTokens curve.fi/busd
      '0xC2cB1040220768554cf699b0d863A3cd4324ce32',
      '0x26EA744E5B887E5205727f55dFBE8685e3b21951',
      '0xE6354ed5bC4b393a5Aad09f21c46E101e692d447',
      '0x04bC0Ab673d88aE9dbC9DA2380cB6B79C4BCa9aE',

      //ycTokens curve.fi/pax
      '0x99d1Fa417f94dcD62BfE781a1213c092a47041Bc',
      '0x9777d7E2b60bB01759D0E2f8be2095df444cb07E',
      '0x1bE5d71F2dA660BFdee8012dDc58D024448A0A59',
    ]

    let yCalls = yTokens.map((token, i) => ({ target: token }))

    let yRates = await sdk.api.abi.multiCall({
      block,
      calls: yCalls,
      abi:  {
        "constant":true,
        "inputs":[],
        "name":"getPricePerFullShare",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "payable":false,
        "stateMutability":"view",
        "type":"function"
      }
    })
  }**/

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: "Curve Finance",
  token: null,
  category: "DEXes",
  start: 1581138000, // 03/01/2020 @ 5:54pm UTC
  tvl,
};
