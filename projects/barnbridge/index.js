/*==================================================
  Imports
==================================================*/
const sdk = require('../../sdk');
const BigNumber = require('bignumber.js');
const axios = require('axios');

/*==================================================
  Settings
==================================================*/
const SY_POOLS_API_URL = 'https://api-v2.barnbridge.com/api/smartyield/pools';
const SA_POOLS_API_URL = 'https://api-v2.barnbridge.com/api/smartalpha/pools';

const STK_AAVE_ADDRESS = '0x4da27a545c0c5b758a6ba100e3a049001de870f5';
const AAVE_ADDRESS = '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9';

/*==================================================
  API
==================================================*/
async function fetchSyPools(apiUrl) {
    return axios.get(apiUrl)
        .then(res => res.data)
        .then(({status, data}) => status === 200 ? data : []);
}

async function fetchSaPools(apiUrl) {
    return axios.get(apiUrl)
        .then(res => res.data)
        .then(({status, data}) => status === 200 ? data : []);
}

/*==================================================
  Contract
==================================================*/
function syGetUnderlyingTotal(chain, smartYieldAddress, block) {
    return sdk.api.abi.call({
        abi: {
            name: "underlyingTotal",
            type: "function",
            stateMutability: "view",
            constant: true,
            payable: false,
            inputs: [],
            outputs: [
                {
                    name: "total",
                    type: "uint256",
                    internalType: "uint256",
                },
            ],
        },
        target: smartYieldAddress,
        chain,
        block,
    }).then(({output}) => new BigNumber(output));
}

function saGetEpochBalance(chain, smartAlphaAddress, block) {
    return sdk.api.abi.call({
        abi: {
            name: "epochBalance",
            type: "function",
            stateMutability: "view",
            constant: true,
            payable: false,
            inputs: [],
            outputs: [
                {
                    name: "balance",
                    type: "uint256",
                    internalType: "uint256",
                },
            ],
        },
        target: smartAlphaAddress,
        chain,
        block,
    }).then(({output}) => new BigNumber(output));
}

function saGetQueuedJuniorsUnderlyingIn(chain, smartAlphaAddress, block) {
    return sdk.api.abi.call({
        abi: {
            name: "queuedJuniorsUnderlyingIn",
            type: "function",
            stateMutability: "view",
            constant: true,
            payable: false,
            inputs: [],
            outputs: [
                {
                    name: "amount",
                    type: "uint256",
                    internalType: "uint256",
                },
            ],
        },
        target: smartAlphaAddress,
        chain,
        block,
    }).then(({output}) => new BigNumber(output));
}

function saGetQueuedSeniorsUnderlyingIn(chain, smartAlphaAddress, block) {
    return sdk.api.abi.call({
        abi: {
            name: "queuedSeniorsUnderlyingIn",
            type: "function",
            stateMutability: "view",
            constant: true,
            payable: false,
            inputs: [],
            outputs: [
                {
                    name: "amount",
                    type: "uint256",
                    internalType: "uint256",
                },
            ],
        },
        target: smartAlphaAddress,
        chain,
        block,
    }).then(({output}) => new BigNumber(output));
}

/*==================================================
  Helpers
==================================================*/
class TokensBalance {
    #balances = {};

    get balances() {
        return Object.assign({}, this.#balances);
    }

    addTokenToBalance(address, amount) {
        const key = this.resolveAddress(address);

        if (!this.#balances[key]) {
            this.#balances[key] = new BigNumber(0);
        }

        this.#balances[key] = this.#balances[key].plus(amount);
    }

    resolveAddress(address) {
        switch (address) {
            case STK_AAVE_ADDRESS:
                return AAVE_ADDRESS;
            default:
                return address;
        }
    }
}

/*==================================================
  TVL
==================================================*/
async function tvl(timestamp, ethBlock) {
    const chain = '';
    const block = ethBlock;
    const tb = new TokensBalance();

    // calculate TVL from SmartYield pools
    const syPools = await fetchSyPools(SY_POOLS_API_URL);

    try {
        await Promise.all(syPools.map(async syPool => {
            const {smartYieldAddress, underlyingAddress} = syPool;
            const underlyingTotal = await syGetUnderlyingTotal(chain, smartYieldAddress, block);
            tb.addTokenToBalance(underlyingAddress, underlyingTotal);
        }));
    } catch (e) {
        console.log(e)
    }


    // calculate TVL from SmartAlpha pools
    const saPools = await fetchSaPools(SA_POOLS_API_URL);

    try {
        await Promise.all(saPools.map(async saPool => {
            const {poolAddress, poolToken} = saPool;
            const [epochBalance, queuedJuniorsUnderlyingIn, queuedSeniorsUnderlyingIn] = await Promise.all([
                saGetEpochBalance(chain, poolAddress, block),
                saGetQueuedJuniorsUnderlyingIn(chain, poolAddress, block),
                saGetQueuedSeniorsUnderlyingIn(chain, poolAddress, block),
            ]);
    
            const underlyingTotal = epochBalance
                .plus(queuedJuniorsUnderlyingIn)
                .plus(queuedSeniorsUnderlyingIn);
            tb.addTokenToBalance(poolToken.address, underlyingTotal);
        }));
    } catch (e) {
        console.log(e)
    }


    return tb.balances;
}

/*==================================================
  Metadata
==================================================*/
module.exports = {
    name: 'BarnBridge',
    website: 'https://app.barnbridge.com',
    token: 'BOND',
    category: 'Derivatives',
    chain: 'ethereum',
    start: 1615664559, // Mar-24-2021 02:17:40 PM +UTC,
    tvl,
};
