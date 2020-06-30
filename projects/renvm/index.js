/*==================================================
  Modules
  ==================================================*/
  const abi = require("./abi");
  const sdk = require("../../sdk");


/*==================================================
  Settings
  ==================================================*/

  const darknodeRegistryContract = "0x2D7b6C95aFeFFa50C068D50f89C5C0014e054f0A";
  const renBTCContract = "0xeb4c2781e4eba804ce9a9803c67d0893436bb27d";
  const renBCHContract = "0x459086F2376525BdCebA5bDDA135e4E9d3FeF5bf";
  const renZECContract = "0x1C5db575E2Ff833E46a2E9864C22F4B22E0B37C2";
  const renContract = "0x408e41876cccdc0f92210600ef50372656052a38";

  const NULL = "0x0000000000000000000000000000000000000000";

  const renBasis = 1e19;
  const renBond = 10000;


/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    const batchSize = 100;
    const allDarknodes = [];
    let lastDarknode = NULL;
    // This follows the technique used in the Ren control panel
    // We have to iterate over the darknode list to figure out
    // how many bonded nodes there are
    const filter = address => address !== NULL && address !== lastDarknode;
    do {
      const darknodes = (await sdk.api.abi.call({
        block,
        target: darknodeRegistryContract,
        abi: abi["getDarknodes"],
        params: [lastDarknode, batchSize]
      }) || { output: []}).output;
      allDarknodes.push(...darknodes.filter(filter));
      [lastDarknode] = darknodes.slice(-1);
    } while (lastDarknode !== NULL);

    const btcTotalSupply = (
      await sdk.api.erc20.totalSupply({
        block,
        target: renBTCContract
      })
    ).output;

    const bchTotalSupply = (
      await sdk.api.erc20.totalSupply({
        block,
        target: renBCHContract
      })
    ).output;

    const zecTotalSupply = (
      await sdk.api.erc20.totalSupply({
        block,
        target: renZECContract
      })
    ).output;

    // Each darknode must have bonded a fixed amount of Ren.
    // The bond amount could be fetched from the contract
    // but lets save contract calls
    const bondedRen =  allDarknodes.length *  renBond * renBasis;

    const balances = {
      [renContract]: bondedRen,
      [renBTCContract]: btcTotalSupply,
      [renBCHContract]: bchTotalSupply,
      [renZECContract]: zecTotalSupply
    };

    return balances;
  }

  module.exports = {
    name: "RenVM",
    token: "REN",
    category: "assets",
    // FIXME: Need a more accurate date here, where all assets are available, however, it is relatively fair to start at the time mainnet was officially launched
    start: 1590537600, // May-27-2020 00:00:00 PM +UTC
    tvl,
  };
