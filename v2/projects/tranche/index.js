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
            tokens: async () => {
                return (await axios.get('https://api.tranche.finance/api/v1/common/token-address?network=ethereum')).data.result || [];
            },
            holders: async () => {
                return (await axios.get('https://api.tranche.finance/api/v1/common/holder-address?network=ethereum')).data.result || [];
            },
        }
    ]
};
