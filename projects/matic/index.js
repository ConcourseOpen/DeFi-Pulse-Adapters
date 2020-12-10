const sdk = require('../../sdk');

async function tvl(timestamp, block) {
    const etherAddress = '0x0000000000000000000000000000000000000000'

    const posEtherPredicate = '0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30'
    const posERC20Predicate = '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf'
    const plasmaDepositManager = '0x401F6c983eA34274ec46f84D70b31C151321188b'

    let balances = {
        [etherAddress]: (await sdk.api.eth.getBalance({ target: posEtherPredicate, block })).output
    }

    const posTokens = [
        {
            target: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            params: posERC20Predicate
        },
        {
            target: '0x913D8ADf7CE6986a8CbFee5A54725D9Eea4F0729',
            params: posERC20Predicate
        },
        {
            target: '0x8ffe40a3d0f80c0ce6b203d5cdc1a6a86d9acaea',
            params: posERC20Predicate
        },
        {
            target: '0xEE06A81a695750E71a662B51066F2c74CF4478a0',
            params: posERC20Predicate
        },
        {
            target: '0x6b175474e89094c44da98b954eedeac495271d0f',
            params: posERC20Predicate
        },
        {
            target: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            params: posERC20Predicate
        },
        {
            target: '0xC4C2614E694cF534D407Ee49F8E44D125E4681c4',
            params: posERC20Predicate
        },
        {
            target: '0xbca3c97837a39099ec3082df97e28ce91be14472',
            params: posERC20Predicate
        },
        {
            target: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
            params: posERC20Predicate
        },
        {
            target: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
            params: posERC20Predicate
        },
        {
            target: '0x2BF91c18Cd4AE9C2f2858ef9FE518180F7B5096D',
            params: posERC20Predicate
        },
        {
            target: '0xb6ed7644c69416d67b522e20bc294a9a9b405b31',
            params: posERC20Predicate
        }
    ]

    const lockedPoSBalances = await sdk.api.abi.multiCall({
        calls: posTokens,
        abi: 'erc20:balanceOf',
        block
    })

    await sdk.util.sumMultiBalanceOf(balances, lockedPoSBalances)

    const plasmaTokens = [
        {
            target: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
            params: plasmaDepositManager
        },
        {
            target: '0x6b175474e89094c44da98b954eedeac495271d0f',
            params: plasmaDepositManager
        },
        {
            target: '0xa45b966996374E9e65ab991C6FE4Bfce3a56DDe8',
            params: plasmaDepositManager
        }
    ]

    const lockedPlasmaBalances = await sdk.api.abi.multiCall({
        calls: plasmaTokens,
        abi: 'erc20:balanceOf',
        block
    })

    await sdk.util.sumMultiBalanceOf(balances, lockedPlasmaBalances)

    return (await sdk.api.util.toSymbols(balances)).output;
}

module.exports = {
    name: 'Matic Network',
    website: 'https://matic.network',
    token: 'MATIC',
    category: 'payments',
    start: 1514764800,
    tvl
}
