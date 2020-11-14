/*==================================================
  Modules
  ==================================================*/

  const _ = require('underscore');
  const sdk = require('../../sdk');
  const bTvlAbi = require('./btvl');
  const BigNumber = require("bignumber.js");

/*==================================================
  Settings
  ==================================================*/

  const bTvlAddress = '0x60312e01A2ACd1Dac68838C949c1D20C609B20CF';
  const bcdpmanagerAddress = '0x3f30c2381CD8B917Dd96EB2f1A4F96D91324BBed';
  const ethIlk = '0x4554482d41000000000000000000000000000000000000000000000000000000';
  const firstBlock = 11257606
 
/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    if(block < firstBlock) return {'0x0000000000000000000000000000000000000000' : '0'};

    const cdpiRes = await sdk.api.abi.call(
      {block,
       target: bTvlAddress,
       params: [bcdpmanagerAddress],
       abi: bTvlAbi["cdpi"]
    });

    const maxCdp = Number(cdpiRes.output);
    const cdps = Array.from({length: maxCdp}, (_, i) => i + 1)

    const smallCdps = Array.from({length: 20}, (_, i) => i + 1)
    const ethBalances = (await sdk.api.abi.multiCall({
      abi: bTvlAbi["cdpTvl"],
      calls: cdps.map((cdp,) => ({
	target: bTvlAddress,
	params: [bcdpmanagerAddress,cdp,ethIlk]
      })),
      block,
    })).output.map(value => value.output);

    let totalBalance = new BigNumber(0);
    ethBalances.forEach(balance => totalBalance = totalBalance.plus(new BigNumber(balance)));
    
    const balances = {'0x0000000000000000000000000000000000000000' : totalBalance.toString(10)};

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'B.Protocol',
    token: null,
    category: 'lending',
    contributesTo: ['Maker'],
    start: 1605380632,  // 11/14/2020 @ 7:03pm (UTC)
    tvl,
  };
