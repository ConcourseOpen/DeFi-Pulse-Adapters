/*==================================================
  Modules
  ==================================================*/

const sdk = require('../../sdk');
const abi = require("./abi");

const vaults = [
    {
        // USDT
        vault: '0x54bE9254ADf8D5c8867a91E44f44c27f0c88e88A',
        token: '0xdac17f958d2ee523a2206206994597c13d831ec7'
    },
    {
        // WBTC
        vault: '0x1a389c381a8242B7acFf0eB989173Cd5d0EFc3e3',
        token: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'
    },
    {
        // ETH
        vault: '0x1E9DC5d843731D333544e63B2B2082D21EF78ed3',
        token: '0x0000000000000000000000000000000000000000'
    },
]

/*==================================================
  TVL
  ==================================================*/

async function tvl(_timestamp, block) {
    const underlyingTokenBalances = await sdk.api.abi.multiCall({
        calls: vaults.map(({vault}) => ({
          target: vault
        })),
        abi: abi["balance"],
        block,
    });

    return underlyingTokenBalances.output.reduce((acc, result, index)=>{
        acc[vaults[index].token]=result.output;
        return acc
    })
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
    name: 'Flamincome',
    token: 'FLAG',
    category: 'assets',
    start: 1600473600,   // Sep-19-2020 00:00 AM
    tvl
}
