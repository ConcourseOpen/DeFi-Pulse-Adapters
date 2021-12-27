/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');

/*==================================================
  TotalSupply
  ==================================================*/

  async function supply(timestamp, block, tokenContract) {
    const totalSupply = (
      await sdk.api.erc20.totalSupply({
        block,
        target: tokenContract
      })
    ).output;

    return (await sdk.api.util.toSymbols({ [tokenContract]: totalSupply })).output;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    supply,
  };
