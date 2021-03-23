const _ = require('underscore');
const sdk = require('../../sdk');
const BigNumber = require("bignumber.js");

async function tvl(timestamp, block) {
    const etherAddress = '0x0000000000000000000000000000000000000000'

    const posEtherPredicate = '0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30'
    const posERC20Predicate = '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf'
    const plasmaDepositManager = '0x401F6c983eA34274ec46f84D70b31C151321188b'

    const maticToken = '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0'
    const stakeManager = '0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908'

    let balances = {
        [etherAddress]: (await sdk.api.eth.getBalance({ target: posEtherPredicate, block })).output
    }

    // -- Attempt to calculate TVL from mapped POS tokens
    const posTokens = []

    try {

        // Attempt to read list of all mapped ERC20 token addresses
        // via POS bridge
        const resp = await axios.get(PoSMappedTokenList)

        if (resp.status === 200 && resp.data.status === 1) {
          resp.data.tokens =
            resp.data.tokens.filter(token => token.rootToken.toLowerCase() !== maticToken);

            posTokens.push(...resp.data.tokens.map(v => {


                return {
                  target: v.rootToken,
                  params: posERC20Predicate
                }


            }))

        }
    ]

    const lockedPoSBalances = await sdk.api.abi.multiCall({
        calls: posTokens,
        abi: 'erc20:balanceOf',
        block
    })

    await sdk.util.sumMultiBalanceOf(balances, lockedPoSBalances)
    // -- Done with POS tokens

    // -- Attempt to calculate TVL from mapped Plasma tokens
    const plasmaTokens = []

    try {

        // Attempt to read list of all mapped ERC20 token addresses
        // via Plasma bridge
        const resp = await axios.get(PlasmaMappedTokenList)

        if (resp.status === 200 && resp.data.status === 1) {
         resp.data.tokens =
           resp.data.tokens.filter(token => token.rootToken.toLowerCase() !== maticToken);

          plasmaTokens.push(...resp.data.tokens.map(v => {
                return {
                  target: v.rootToken,
                  params: plasmaDepositManager
                }
            }))
        }
    ]

    const lockedPlasmaBalances = await sdk.api.abi.multiCall({
        calls: plasmaTokens,
        abi: 'erc20:balanceOf',
        block
    })

    if (lockedPlasmaBalances.output[2].success) {
        balances[etherAddress] =new BigNumber(balances[etherAddress]).plus(lockedPlasmaBalances.output[2].output)
        lockedPlasmaBalances.output[2].output = '0';
    }

    await sdk.util.sumMultiBalanceOf(balances, lockedPlasmaBalances)

    return (await sdk.api.util.toSymbols(balances)).output;
}

module.exports = {
    name: 'Polygon',
    website: 'https://polygon.technology/',
    token: 'MATIC',
    category: 'Payments',
    start: 1590824836, // Sat May 30 13:17:16 2020
    tvl
}
