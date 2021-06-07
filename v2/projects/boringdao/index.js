const sdk = require('../../../sdk/index');

module.exports = {
    /* Project Metadata */
    name: 'BoringDAO',
    token: null,
    category: 'Assets',
    start: 1607745161,
    /* required for fetching token balances */
    tokenHolderMap: [
        {
            tokens: '0x3c9d6c1c73b31c837832c72e04d3152f051fc1a9',
            holders: [
                '0x258a1eb6537Ae84Cf612f06B557B6d53f49cC9A1', // oBTC Tunnel
                '0xD7D997Dd57114E1e2d64ab8c0d767A0d6b2426F0', // oLTC Tunnel
                '0x22b1AC6B2d55ade358E5b7f4281ed1Dd2f6f0077' // oDOGE Tunnel
            ]
        },
        {
            tokens: '0x07C44B5Ac257C2255AA0933112c3b75A6BFf3Cb1', // oLTC
            holders: [
                '0x25ab2daf6a4ab862c0dbfe899d019f11dcd5135f',
                '0xe300a54cf3213c10364e2b6cd9391b12f837a834',
                '0xc251a54bffa8db9b64ac05bd38ad4891f60c2de3',
                '0x06d95481af387e0940a11560f5a34691ea0e4386'
            ]
        },
        {
            tokens: '0x8064d9ae6cdf087b1bcd5bdf3531bd5d8c537a68', // oBTC
            holders: [
                '0xd81da8d904b52208541bade1bd6595d8a251f8dd',
                '0xf29e1be74d1f9e3436e8b7ad2756f19a904e7b48',
                '0x53e9fb796b2feb4b3184afdf601c2a2797548d88',
                '0x674bdf20a0f284d710bc40872100128e2d66bd3f',


            ]
        },
        {
            tokens: '0x9c306A78b1a904e83115c05Ac67c1Ef07C653651', // oDOGE
            holders: [
                '0xb18fbfe3d34fdc227eb4508cde437412b6233121',
                '0x5e9f5af18e1b9505d8ce2ab4e8a349a98abf51c1',
                '0x34130162218d1f81bc84761b8bf863f7f409f633',
                '0x5387aed486b9ee6ac7833640f8ddfd6bbcd01d96'
            ]
        },
        {
            tokens: [
                '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
                '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
                '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
                '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
                '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e', // YFI
                '0xa1d0E215a23d7030842FC67cE582a6aFa3CCaB83', // YFII
                '0x514910771af9ca656af840dff83e8264ecf986ca', // LINK
                '0x04abeda201850ac0124161f037efd70c74ddc74c', // NEST
                '0xba11d00c5f74255f56a5e366f4f77f5a186d7f55', // BAND
                '0x0316EB71485b0Ab14103307bf65a021042c6d380', // HBTC
            ],
            holders: [
                '0x41edC2C7212367FC59983890aad48B92b0Fe296d', // DAI Pool
                '0xEa8BBbb296D9d15e91E65ea2b189663805BB5916', // LINK Pool
                '0x89F0112A9c75D987686C608ca1840f9C7344B7fF', // USDC Pool
                '0xe42b6deA46AA64120b95e75D084f42579ED8a384', // WETH Pool
                '0xA6172034B1750842f12de7722Bb6cD5D4f107761', // USDT Pool
                '0xb035Dd8e7Ebb8B73A99270A12DE9D448d15de2bf', // YFI Pool
                '0xC80DBede0E3CabC52c5a4a3bc9611913e49b8dCc', // YFII Pool
                '0xfaacABc2468736f43eDC57f5e6080B8b48BbD050', // NEST Pool
                '0xF99125968D45f88d625ADCF79700628ACDA65D6b', // BAND Pool
                '0xb09a612Ebe2AA5750C51eb317820C6f2866A9ca6', // HBTC Pool
            ]
        }
    ],
};
