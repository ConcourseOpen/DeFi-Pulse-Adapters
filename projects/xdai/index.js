/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');

/*==================================================
  Main
  ==================================================*/

  async function run(timestamp, block) {
    const bridgeAddress = '0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016';
    const saiAddress = '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359';
    const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
    const chaiAddress = '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215';
    const mcdMigrationBlock = 9162031
    const initializeChaiBlock = 9779414;
    const saiShutdownBlock = 9884448;

    let saiBalance = '0'
    let daiBalance = '0'
    let chaiBalance = '0'

    saiBalance = (await sdk.api.erc20.balanceOf({
      target: saiAddress,
      owner: bridgeAddress,
      block: Math.min(block, saiShutdownBlock)
    })).output;

    if (block >= mcdMigrationBlock) {
      daiBalance = (await sdk.api.erc20.balanceOf({
        target: daiAddress,
        owner: bridgeAddress,
        block
      })).output;
    }

    if (block >= initializeChaiBlock) {
      chaiBalance = (await sdk.api.abi.call({
        target: bridgeAddress,
        abi: {
          constant: true,
          inputs: [],
          name: "dsrBalance",
          outputs: [
            {
              name: "balance",
              type: "uint256"
            }
          ],
          payable: false,
          stateMutability: "view",
          type: "function"
        },
        block
      })).output;
    }
    
    const balances = {
      [saiAddress]: saiBalance,
      [daiAddress]: daiBalance,
      [chaiAddress]: chaiBalance
    };

    const symbolBalances = await sdk.api.util.toSymbols(balances);

    return symbolBalances.output;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'xDai',
    token: null,
    category: 'Payments',
    start: 1539028166,
    run
  }
