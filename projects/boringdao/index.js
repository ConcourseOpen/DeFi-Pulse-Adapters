/*==================================================
  Modules
==================================================*/

const sdk = require('../../../sdk');

/*==================================================
  Settings
==================================================*/

const BORContract = '0x3c9d6c1c73b31c837832c72e04d3152f051fc1a9';
const oBTCContract = '0x8064d9ae6cdf087b1bcd5bdf3531bd5d8c537a68';
const oLTCContract = '0x07C44B5Ac257C2255AA0933112c3b75A6BFf3Cb1';



/*==================================================
  Main
==================================================*/

async function balance(timestamp, block) {
    const oBTCTotalSupply = (
        await sdk.api.erc20.totalSupply({
            block,
            target: oBTCContract
        })
    ).output;

    return {
        [oBTCContract]: oBTCTotalSupply
    };
}

/*==================================================
  Exports
==================================================*/

module.exports = {
    name: 'BoringDAO BTC',
    symbol: "oBTC",
    type: 'Hybrid',
    start: 1605269554, // Nov-12-2020 08:25:54 AM +UTC
    balance,
};