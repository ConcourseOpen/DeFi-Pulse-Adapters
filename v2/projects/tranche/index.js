const sdk = require('../../../sdk/index');
const axios = require('axios');

module.exports = {
    /* Project Metadata */
    name: "TRANCHE",
    token: "SLICE",
    website: "https://tranche.finance/",
    category: "Derivatives",
    start: 1574241665,
    /* required for fetching token balances */
    tokenHolderMap: [
        {
            tokens: [
                '0x39aa39c021dfbae8fac545936693ac917d5e7563',
                '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
                '0x0AeE8703D34DD9aE107386d3eFF22AE75Dd616D1',
                '0xccf4429db6322d5c611ee964527d42e5d685dd6a',
                '0xface851a4921ce59e912d19329929ce6da6eb0c7'
            ],
            holders: [
                '0x05060F5ab3e7A98E180B418A96fFc82A85b115e7',
                '0xAB4235a9ACf00A45557E90F7dB127f3b293cA45A'
            ]
        }
    ]
};
