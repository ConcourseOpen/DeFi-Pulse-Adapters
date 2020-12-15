const sdk = require('../../sdk');
const BigNumber = require('bignumber.js');
const COMP_abi = require('./abis/COMP.json');
const IdleTokenV4 = require('./abis/IdleTokenV4.json');
const IdleTokenV3 = require('./abis/IdleTokenV3.json');

const BNify = n => new BigNumber(n);
const web3Call = async (block,target,abi,params=null) => {
  const res = await sdk.api.abi.call({
    abi,
    block,
    params,
    target
  });
  return res ? (res.output || null) : null;
}

// Idle tokens info
const contracts = {
  idleDAIYieldV4:{
    abi:IdleTokenV4,
    underlyingToken:'DAI',
    address:'0x3fe7940616e5bc47b0775a0dccf6237893353bb4'
  },
  idleDAIYieldV3:{
    abi:IdleTokenV3,
    underlyingToken:'DAI',
    address:'0x78751b12da02728f467a44eac40f5cbc16bd7934'
  },
  idleUSDCYieldV4:{
    abi:IdleTokenV4,
    underlyingToken:'USDC',
    address:'0x5274891bEC421B39D23760c04A6755eCB444797C'
  },
  idleUSDCYieldV3:{
    abi:IdleTokenV3,
    underlyingToken:'USDC',
    address:'0x12B98C621E8754Ae70d0fDbBC73D6208bC3e3cA6'
  },
  idleUSDTYieldV4:{
    abi:IdleTokenV4,
    underlyingToken:'USDT',
    address:'0xF34842d05A1c888Ca02769A633DF37177415C2f8'
  },
  idleUSDTYieldV3:{
    abi:IdleTokenV3,
    underlyingToken:'USDT',
    address:'0x63D27B3DA94A9E871222CB0A32232674B02D2f2D'
  },
  idleSUSDYieldV4:{
    abi:IdleTokenV4,
    underlyingToken:'SUSD',
    address:'0xf52cdcd458bf455aed77751743180ec4a595fd3f'
  },
  idleSUSDYieldV3:{
    abi:IdleTokenV3,
    underlyingToken:'SUSD',
    address:'0xe79e177d2a5c7085027d7c64c8f271c81430fc9b'
  },
  idleTUSDYieldV4:{
    abi:IdleTokenV4,
    underlyingToken:'TUSD',
    address:'0xc278041fDD8249FE4c1Aad1193876857EEa3D68c'
  },
  idleTUSDYieldV3:{
    abi:IdleTokenV3,
    underlyingToken:'TUSD',
    address:'0x51C77689A9c2e8cCBEcD4eC9770a1fA5fA83EeF1'
  },
  idleWBTCYieldV4:{
    abi:IdleTokenV4,
    underlyingToken:'WBTC',
    address:'0x8C81121B15197fA0eEaEE1DC75533419DcfD3151'
  },
  idleWBTCYieldV3:{
    abi:IdleTokenV3,
    underlyingToken:'WBTC',
    address:'0xD6f279B7ccBCD70F8be439d25B9Df93AEb60eC55'
  },
  idleDAISafeV4:{
    abi:IdleTokenV4,
    underlyingToken:'DAI',
    address:'0xa14ea0e11121e6e951e87c66afe460a00bcd6a16'
  },
  idleDAISafeV3:{
    abi:IdleTokenV3,
    underlyingToken:'DAI',
    address:'0x1846bdfDB6A0f5c473dEc610144513bd071999fB'
  },
  idleUSDCSafeV4:{
    abi:IdleTokenV4,
    underlyingToken:'USDC',
    address:'0x3391bc034f2935ef0e1e41619445f998b2680d35'
  },
  idleUSDCSafeV3:{
    abi:IdleTokenV3,
    underlyingToken:'USDC',
    address:'0xcDdB1Bceb7a1979C6caa0229820707429dd3Ec6C'
  },
  idleUSDTSafeV4:{
    abi:IdleTokenV4,
    underlyingToken:'USDT',
    address:'0x28fAc5334C9f7262b3A3Fe707e250E01053e07b5'
  },
  idleUSDTSafeV3:{
    abi:IdleTokenV3,
    underlyingToken:'USDT',
    address:'0x42740698959761baf1b06baa51efbd88cb1d862b'
  }
};

// Underlying tokens contracts
const underlyingTokens = {
  DAI: {
    decimals:18,
    address:'0x6b175474e89094c44da98b954eedeac495271d0f',
  },
  USDC: {
    decimals:6,
    address:'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  },
  USDT: {
    decimals:6,
    address:'0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
  SUSD: {
    decimals:18,
    address:'0x57ab1ec28d129707052df4df418d58a2d46d5f51',
  },
  TUSD: {
    decimals:18,
    address:'0x0000000000085d4780b73119b644ae5ecd22b376',
  },
  WBTC: {
    decimals:8,
    address:'0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'
  }
};

// Initialize COMP
const COMPAddr = '0xc00e94cb662c3520282e6f5717214004a7f26888'

async function tvl(timestamp, block) {

  // Calculate TVL
  const calls = [];

  Object.keys(contracts).forEach( (contractName) => {
    const call = new Promise( async (resolve, reject) => {

      const tokenBalances = {};
      const contractInfo = contracts[contractName];
      const tokenDecimals = underlyingTokens[contractInfo.underlyingToken].decimals;
      const underlyingTokenAddr = underlyingTokens[contractInfo.underlyingToken].address;

      let [
        tokenPrice,
        compBalance,
        totalSupply,
        underlyingTokenBalance
      ] = await Promise.all([
        web3Call(block,contractInfo.address,contractInfo.abi.tokenPrice),
        web3Call(block,COMPAddr,COMP_abi.balanceOf,contractInfo.address),
        web3Call(block,contractInfo.address,contractInfo.abi.totalSupply),
        web3Call(block,underlyingTokenAddr,'erc20:balanceOf',contractInfo.address)
      ]);

      if (totalSupply && tokenPrice){
        let tokenTVL = BNify(totalSupply).div(1e18).times(BNify(tokenPrice).div(`1e${tokenDecimals}`));

        // Get unlent funds
        if (underlyingTokenBalance){
          underlyingTokenBalance = BNify(underlyingTokenBalance);
          if (!underlyingTokenBalance.isNaN() && underlyingTokenBalance.gt(0)){
            underlyingTokenBalance = underlyingTokenBalance.div(`1e${tokenDecimals}`);
            tokenTVL = tokenTVL.plus(underlyingTokenBalance);
          }
        }

        tokenTVL = tokenTVL.times(`1e${tokenDecimals}`);
        tokenBalances[underlyingTokenAddr] = tokenTVL;
      }

      // Get COMP balance
      compBalance = BNify(compBalance);
      if (!compBalance.isNaN() && compBalance.gt(0)){
        tokenBalances[COMPAddr] = compBalance;
      }

      resolve(tokenBalances);
    });

    calls.push(call);
  });

  const balances = {};
  const tokensBalances = await Promise.all(calls);


  tokensBalances.forEach( tokenBalances => {
    Object.keys(tokenBalances).forEach( tokenAddr => {
      if (!balances[tokenAddr]){
        balances[tokenAddr] = BNify(0);
      }
      balances[tokenAddr] = balances[tokenAddr].plus(tokenBalances[tokenAddr]);
    });
  });

  return balances;
}

module.exports = {
  tvl,
  token: "IDLE",
  start: 1605817213,
  name: 'Idle Finance',
  category: 'lending',
  website: 'https://idle.finance'
};