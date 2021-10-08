/*==================================================
  Modules
  ==================================================*/

const sdk = require("../../sdk");
const abi = require("./abi");

const ethCallVault = "0x0fabaf48bbf864a3947bdd0ba9d764791a60467a";
const ethCallVaultV2 = '0x25751853Eab4D0eB3652B5eB6ecB102A2789644B'
const wbtcCallVault = "0x8b5876f5B0Bf64056A89Aa7e97511644758c3E8c";
const wbtcCallVaultV2 = '0x65a833afDc250D9d38f8CD9bC2B1E3132dB13B2F'
const ethPutVault = "0x16772a7f4a3ca291C21B8AcE76F9332dDFfbb5Ef";
const yearnEthPutVault = "0x8FE74471F198E426e96bE65f40EeD1F8BA96e54f";

const weth = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const wbtc = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
const usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

const zero = "0";

/*==================================================
  TVL
  ==================================================*/

async function getVaultTotalBalance(vault, block) {
  try {
    const output = (
      await sdk.api.abi.call({
        target: vault,
        block,
        abi: abi.totalBalance,
      })
    ).output;
    return output;
  } catch (err) {
    return 0;
  }
}

async function tvl(timestamp, block) {
  const [
    ethCallVaultBalance,
    ethCallVaultV2Balance,
    wbtcCallVaultBalance,
    wbtcCallVaultV2Balance,
    ethPutVaultBalance,
    yearnEthPutVaultBalance,
  ] = await Promise.all([
    getVaultTotalBalance(ethCallVault, block),
    getVaultTotalBalance(ethCallVaultV2, block),
    getVaultTotalBalance(wbtcCallVault, block),
    getVaultTotalBalance(wbtcCallVaultV2, block),
    getVaultTotalBalance(ethPutVault, block),
    getVaultTotalBalance(yearnEthPutVault, block),
  ]);

  let balances = {
    [weth]: Number(ethCallVaultBalance) + Number(ethCallVaultV2Balance),
    [wbtc]: Number(wbtcCallVaultBalance) + Number(wbtcCallVaultV2Balance),
    [usdc]: Number(ethPutVaultBalance) + Number(yearnEthPutVaultBalance),
  };

  return balances;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: "Ribbon Finance",
  token: null,
  category: "derivatives",
  start: 1618185600,
  tvl,
};
