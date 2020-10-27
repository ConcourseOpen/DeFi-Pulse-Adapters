/*==================================================
  Modules
  ==================================================*/

const sdk = require('../../sdk');
const abi = require('./abi');
const _ = require('underscore');
const BigNumber = require('bignumber.js');

/*==================================================
  Settings
  ==================================================*/

const perlinX = '0x5Fa19F612dfd39e6754Bb2E8300E681d1C589Dd4';


/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {

    let balances = {};

    const poolCount = await sdk.api.abi.call({
        target: perlinX,
        abi: abi.poolCount,
        block
    });

    let counts = []
    for (let i = 0; i < poolCount.output; i++) {
        counts.push(i)
    }

    const pools = await sdk.api.abi.multiCall({
        block,
        calls: _.map(counts, (count) => {
            return {
                target: perlinX,
                params: count
            }
        }),
        abi: abi.arrayPerlinPools
    });

    let activePools = await sdk.api.abi.multiCall({
        block,
        calls: _.map(pools.output, (pool) => {
            return {
                target: perlinX,
                params: pool.output
            }
        }),
        abi: abi.poolIsListed
    });

    activePools = _.map(activePools.output, (pool) => {
        return {
            address: pool.input.params[0],
            active: pool.output
        }
    })
    activePools = _.filter(activePools, (pool) => pool.active)

    const poolTokenData = (await sdk.api.abi.multiCall({
        calls: _.map(activePools, (activePool) => ({ target: activePool.address })),
        abi: abi.getCurrentTokens,
    })).output;

    let poolCalls = [];

    _.forEach(poolTokenData, (poolToken) => {
        let poolTokens = poolToken.output;
        let poolAddress = poolToken.input.target;

        _.forEach(poolTokens, (token) => {
            poolCalls.push({
                target: token,
                params: poolAddress,
            });
        })
    });

    let poolBalances = (await sdk.api.abi.multiCall({
        block,
        calls: poolCalls,
        abi: 'erc20:balanceOf'
    })).output;

    _.each(poolBalances, (balanceOf) => {
        if (balanceOf.success) {
            let balance = balanceOf.output;
            let address = balanceOf.input.target;

            if (BigNumber(balance).toNumber() <= 0) {
                return;
            }

            balances[address] = BigNumber(balances[address] || 0).plus(balance).toFixed();
        }
    });

    return balances;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
    name: 'PerlinX',
    token: null,
    category: 'derivatives',
    start: 1598529600,
    tvl
}
