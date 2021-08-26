/*==================================================
  Modules
  ==================================================*/

const poolsV888 = {
  ETH: "0x878f15ffc8b894a1ba7647c7176e4c01f74e140b",
  WBTC: "0x20DD9e22d22dd0a6ef74a520cb08303B5faD5dE7"
};

const poolsV8888 = {
  ETH_CALL: "0xb9ed94c6d594b2517c4296e24A8c517FF133fb6d",
  ETH_PUT: "0x790e96E7452c3c2200bbCAA58a468256d482DD8b",
  WBTC_CALL: "0xfA77f713901a840B3DF8F2Eb093d95fAC61B215A",
  WBTC_PUT: "0x7A42A60F8bA4843fEeA1bD4f08450D2053cC1ab6"
};

const tokens = {
  ETH: "0x0000000000000000000000000000000000000000",
  WBTC: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  WETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
};

/*==================================================
  tokenHolderMap
  ==================================================*/

const tokenHolderMap = [
  {
    checkETHBalance: true,
    holders: [poolsV888.ETH],
    tokens: [tokens.ETH]
  },
  {
    holders: [poolsV888.WBTC, poolsV8888.WBTC_CALL],
    tokens: [tokens.WBTC]
  },
  {
    holders: [poolsV8888.WBTC_PUT, poolsV8888.ETH_PUT],
    tokens: [tokens.USDC]
  },
  {
    holders: [poolsV8888.ETH_CALL],
    tokens: [tokens.WETH]
  }
];

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: "Hegic",
  token: "HEGIC",
  category: "Derivatives",
  start: 1602360000, // Oct-10-2020 08:00:00 PM +UTC,
  tokenHolderMap
};
