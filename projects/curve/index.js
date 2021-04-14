/*==================================================
  Modules
  ==================================================*/

const sdk = require("../../sdk");
const _ = require("underscore");
_.flatMap = _.compose(_.flatten, _.map);

const abi = require("./abi.json");
const { object } = require("underscore");

/*==================================================
  Constants
  ==================================================*/

const CurveAddressProvider = "0x0000000022d53366457f9d5e68ec105046fc4383";
const etherAddress = "0x0000000000000000000000000000000000000000";
const curveEtherAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
const CurveRegistryStart = 11218787;

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  let curvePools = [
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

  let registryStart = block > CurveRegistryStart;
  let balances = {};
  balances[curveEtherAddress] = 0;
  balances["0x6B175474E89094C44Da98b954EedeAC495271d0F"] = 0;
  balances["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"] = 0;
  let poolInfo = {};
  let CurveRegistryAddress;

  if (registryStart) {
    CurveRegistryAddress = (await sdk.api.abi.call({
      block,
      target: CurveAddressProvider,
      abi: abi["get_registry"]
    })).output
  }

  let poolCount = registryStart
    ? (
        await sdk.api.abi.call({
          block,
          target: CurveRegistryAddress,
          abi: abi["pool_count"],
        })
      ).output
    : curvePools.length;

  for (let i = 0; i < poolCount; i++) {
    let poolAddress = registryStart ? (
      await sdk.api.abi.call({
        block,
        target: CurveRegistryAddress,
        abi: abi["pool_list"],
        params: i,
      })
    ).output : curvePools[i];
    poolInfo[poolAddress] = {};

    for (let x = 0; ; x++) {
      try {
        let coin = await sdk.api.abi.call({
          block,
          target: poolAddress,
          abi: abi["coins128"],
          params: x,
        });

        if (coin.output) {
          let balance = await sdk.api.abi.call({
            block,
            target: poolAddress,
            abi: abi["balances128"],
            params: x,
          });
          if (balance.output) {
            poolInfo[poolAddress][coin.output] = balance.output;
          }
        }
      } catch (e) {
        try {
          let coin = await sdk.api.abi.call({
            block,
            target: poolAddress,
            abi: abi["coins256"],
            params: x,
          });

          if (coin.output) {
            let balance = await sdk.api.abi.call({
              block,
              target: poolAddress,
              abi: abi["balances256"],
              params: x,
            });
            if (balance.output) {
              poolInfo[poolAddress][coin.output] = balance.output;
            }
          }
        } catch (e) {
          break;
        }
      }
    }
  }

  let poolKeys = Object.keys(poolInfo);
  for (let i = 0; i < poolKeys.length; i++) {
    let coinKeys = Object.keys(poolInfo[poolKeys[i]]);

    for (let x = 0; x < coinKeys.length; x++) {
      if (!balances[coinKeys[x]]) balances[coinKeys[x]] = 0;

      balances[coinKeys[x]] = String(
        parseFloat(balances[coinKeys[x]]) +
          parseFloat(poolInfo[poolKeys[i]][coinKeys[x]])
      );
    }
  }

  delete balances['0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490'];
  delete balances['0x075b1bb99792c9E1041bA13afEf80C91a1e70fB3'];
  delete balances['0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8']

  let { output } = await sdk.api.util.toSymbols(balances);

  const yTokens = [
    {
      symbol: "ySUSD",
      underlying: "SUSD",
      contract: "0x57ab1ec28d129707052df4df418d58a2d46d5f51",
    },
    {
      symbol: "yUSDC",
      underlying: "USDC",
      contract: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    },
    {
      symbol: "ycDAI",
      underlying: "cDAI",
      contract: "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643",
    },
    {
      symbol: "yUSDT",
      underlying: "USDT",
      contract: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    },
    {
      symbol: "ycUSDC",
      underlying: "cUSDC",
      contract: "0x39aa39c021dfbae8fac545936693ac917d5e7563",
    },
    {
      symbol: "ycUSDT",
      underlying: "cUSDT",
      contract: "0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9",
    },
    {
      symbol: "yBUSD",
      underlying: "BUSD",
      contract: "0x4fabb145d64652a948d72533023f6e7a623c7c53",
    },
    {
      symbol: "yDAI",
      underlying: "DAI",
      contract: "0x6b175474e89094c44da98b954eedeac495271d0f",
    },
    {
      symbol: "yTUSD",
      underlying: "TUSD",
      contract: "0x0000000000085d4780b73119b644ae5ecd22b376",
    },
  ];

  // Count y tokens as their underlying asset, ie ycDAI = cDAI
  output.map((_token) => {
    const yToken = yTokens.filter((token) => token.symbol === _token.symbol)[0];
    // is y token
    if (yToken) {
      let _data = output.find((t) => t.symbol === yToken.underlying);

      if (!_data) {
        _data = {
          symbol: yToken.underlying,
          address: yToken.contract,
          balance: 0,
        };

        output.push(_data);
      }
      // Update balance
      _data.balance = String(
        parseFloat(_data.balance) + parseFloat(_token.balance)
      );
    }
  });

  output = output.filter(
    (_token) => !yTokens.find((token) => token.symbol === _token.symbol)
  );
  for (let out of output) {
    if (out.symbol === "ETH") {
      out.address = etherAddress;
    }
  }

  return output;
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
