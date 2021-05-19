/*==================================================
  Modules
  ==================================================*/

const sdk = require('../../sdk');

/*==================================================
  TVL
  ==================================================*/

// Treasury TVL consists of DAI balance + Sushi SLP balance
async function tvl(timestamp, block) {
  const treasuryAddress = "0x886CE997aa9ee4F8c2282E182aB72A705762399D";
  const dai = "0x6b175474e89094c44da98b954eedeac495271d0f";
  const ohm = "0x383518188c0c6d7730d91b2c03a03c837814a899";
  const slp = "0x34d7d7aaf50ad4944b70b320acb24c95fa2def7c";

  // Calculate how much DAI the treasury has.
  const treasuryDai = (
    await sdk.api.erc20.balanceOf({ target: dai, owner: treasuryAddress, block })
  ).output;

  // Calculate Protocol-owned liquidity from SLP.
  const treasurySlpBalance = (
    await sdk.api.erc20.balanceOf({ target: slp, owner: treasuryAddress, block })
  ).output;

  // // Calculate total SLP and DAI+OHM breakdown.
  // const totalSLPSupply = (
  //   await sdk.api.erc20.totalSupply({ target: slp, block })
  // ).output;
  // const daiSLPBalance = (
  //   await sdk.api.erc20.balanceOf({ target: dai, owner: slp, block })
  // ).output;
  // const ohmSLPBalance = (
  //   await sdk.api.erc20.balanceOf({ target: ohm, owner: slp, block })
  // ).output;

  // // Calculate how much dai + ohm the protocol owns in the SLP.
  // // Multiply and divide by power of 10 to normalize to wei.
  // const treasuryDaiBalance = treasurySlpBalance * daiSLPBalance / (totalSLPSupply * Math.pow(10, 2));
  // const treasuryOHMBalance = treasurySlpBalance * ohmSLPBalance * Math.pow(10, 9) / totalSLPSupply;

  return (await sdk.api.util.toSymbols({
    [dai]: treasuryDai,
    [slp]: treasurySlpBalance
  })).output;
}


/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: 'Olympus',
  token: 'OHM',
  category: 'assets',
  start: 1616569200, // March 24th, 2021
  tvl
}
