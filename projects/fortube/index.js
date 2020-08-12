/*==================================================
  Modules
  ==================================================*/

const sdk = require("../../sdk");
const _ = require("underscore");
const abi = require("./abi.json");

/*==================================================
    Settings
    ==================================================*/
const ForTube = "0xE48BC2Ba0F2d2E140382d8B5C8f261a3d35Ed09C";
const EthAddress = "0x0000000000000000000000000000000000000000";

async function getCollateralMarketsLength(block) {
    return (
        await sdk.api.abi.call({
            block,
            target: ForTube,
            params: [],
            abi: abi["getCollateralMarketsLength"],
        })
    ).output;
}

// returns {asset: {symbol, decimals}}
async function getErc20Assets(block) {
    let erc20Assets = [];
    let calls = [];
    let length = await getCollateralMarketsLength(block);
    for (var i = 0; i < length; i++) {
        calls.push({
            target: ForTube,
            params: i,
        });
    }
    let erc20AssetResults = await sdk.api.abi.multiCall({
        block,
        calls: calls,
        abi: abi["collateralTokens"],
    });
    _.each(erc20AssetResults.output, (result) => {
        if (result.success && result.output != EthAddress) {
            erc20Assets.push(result.output);
        }
    });

    return erc20Assets;
}

/*==================================================
    TVL
    ==================================================*/
async function tvl(timestamp, block) {
    let balances = {};
    let erc20Assets = await getErc20Assets(block);

    // Get erc20 assets locked
    let balanceOfResults = await sdk.api.abi.multiCall({
        block,
        calls: _.map(erc20Assets, (asset) => ({
            target: asset,
            params: ForTube,
        })),
        abi: "erc20:balanceOf",
    });

    //add ETH tvl
    balances[EthAddress] = (
        await sdk.api.eth.getBalance({ target: ForTube, block })
    ).output;

    sdk.util.sumMultiBalanceOf(balances, balanceOfResults);

    return balances;
}

/*==================================================
    Exports
    ==================================================*/

module.exports = {
    name: "ForTube",
    website: 'https://for.tube',
    token: "FOR",
    category: "Lending",
    start: 1596294236, // Aug-01-2020 03:03:56 PM +UTC, block 10574574 
    tvl,
};