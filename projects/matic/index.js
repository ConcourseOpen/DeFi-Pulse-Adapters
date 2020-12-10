const sdk = require('../../sdk');

async function tvl(timestamp, block) {
    const etherAddress = '0x0000000000000000000000000000000000000000'

    const posEtherPredicate = '0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30'

    let balances = {
        [etherAddress]: (await sdk.api.eth.getBalance({ target: posEtherPredicate, block })).output
    }

    const plasmaTokens = [
        {
            target: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
            params: '0x401F6c983eA34274ec46f84D70b31C151321188b'
        },
        {
            target: '0x6b175474e89094c44da98b954eedeac495271d0f',
            params: '0x401F6c983eA34274ec46f84D70b31C151321188b'
        },
        {
            target: '0xa45b966996374E9e65ab991C6FE4Bfce3a56DDe8',
            params: '0x401F6c983eA34274ec46f84D70b31C151321188b'
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
