/*==================================================
  Modules
  ==================================================*/

const sdk = require("../../sdk");
const abi = require("./abi");
const _ = require("underscore");
const BigNumber = require("bignumber.js");
const fetch = require("node-fetch");
const fs = require("fs");
const util = require("util");
const Web3 = require("Web3");
const readFile = util.promisify(fs.readFile);

const alchemyApiKey = "";
const provider = `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`;
const web3 = new Web3(provider);

/*==================================================
  Settings
  ==================================================*/

const registryAdapterAddresses = [
  "0xF4fB8903A41fC78686b26DE55502cdE42a4c6c78", // V1 Vaults
  "0x14d6E0908baE40A2487352B2a9Cb1A6232DA8785", // V2 Vaults
  "0xec7Ac8AC897f5082B2c3d4e8D2173F992A097F24", // Iron Bank
  "0x560144C25E53149aC410E5D33BDB131e49A850e5", // veCRV
  "0x1007eD6fdFAC72bbea9c719cf1Fa9C355D248691", // Earn
];

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 4,
});

const balances = {};
let tvlByAdapter = {};
let totalTvl = new BigNumber(0);

/*==================================================
  Eth_call Override Configuration
  ==================================================*/

const contractOverrideMapping = {
  "0xF4fB8903A41fC78686b26DE55502cdE42a4c6c78":
    "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441", // v1 vaults
  "0x14d6E0908baE40A2487352B2a9Cb1A6232DA8785":
    "0x36e75e2c9e6A123A36c4aC88765a5dd1d6D0c350", // v2 vaults
  "0xec7Ac8AC897f5082B2c3d4e8D2173F992A097F24":
    "0x74631B22963FCF793A197E75A408633475Ac9A0c", // iron bank
  "0x560144C25E53149aC410E5D33BDB131e49A850e5":
    "0x6E9ccD1496Ef424cb1E75eb1422eaaC4D0AeE851", // veCRV
  "0x1007eD6fdFAC72bbea9c719cf1Fa9C355D248691":
    "0x5E474642aF9B466D7C1710A2Bab39762BFE17265", // earn
};

const historicalQuery = async (target, methodAndArgs, blockNumber) => {
  const newTarget = contractOverrideMapping[target];
  const calculationsSushiswap = await getByteCode("calculationsSushiswap");
  const calculationsIronBank = await getByteCode("calculationsIronBank");
  const calculationsCurve = await getByteCode("calculationsCurve");
  const oracle = await getByteCode("oracle");
  const tvlAdapterV2Vaults = await getByteCode("tvlAdapterV2Vaults");
  const tvlAdapterV1Vaults = await getByteCode("tvlAdapterV1Vaults");
  const tvlAdapterIronBank = await getByteCode("tvlAdapterIronBank");
  const tvlAdapterVeCrv = await getByteCode("tvlAdapterVeCrv");
  const tvlAdapterEarn = await getByteCode("tvlAdapterEarn");
  return `{
        "method": "eth_call",
        "params": [{
                "to": "${newTarget}",
                "data": "${methodAndArgs}"
        }, "0x${blockNumber.toString(16)}", {
                "0x466FbFf54d2123c36e9CfAf90298bA436250c043": {
                        "code": "0x${calculationsSushiswap}"
                },
                "0xB2f3AF0986f8D2D95992c3d8ba4FDDD4dCFf60c9": {
                        "code": "0x${calculationsIronBank}"
                },
                "0xF4e3E00e1feb2daae03f44680dFFC48608883080": {
                        "code": "0x${calculationsCurve}"
                },
                "0x190c2CFC69E68A8e8D5e2b9e2B9Cc3332CafF77B": {
                        "code": "0x${oracle}"
                },
                "0x36e75e2c9e6A123A36c4aC88765a5dd1d6D0c350": {
                        "code": "0x${tvlAdapterV2Vaults}"
                },
                "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441": {
                        "code": "0x${tvlAdapterV1Vaults}"
                },
                "0x74631B22963FCF793A197E75A408633475Ac9A0c": {
                        "code": "0x${tvlAdapterIronBank}"
                },
                "0x6E9ccD1496Ef424cb1E75eb1422eaaC4D0AeE851": {
                        "code": "0x${tvlAdapterVeCrv}"
                },
                "0x5E474642aF9B466D7C1710A2Bab39762BFE17265": {
                        "code": "0x${tvlAdapterEarn}"
                }
        }],
        "id": 1,
        "jsonrpc": "2.0"
}`;
};

const performQuery = async (target, methodAndArgs, blockNumber) => {
  const body = await historicalQuery(target, methodAndArgs, blockNumber);
  return (
    await fetch(provider, {
      method: "POST",
      body,
    }).then((res) => res.json())
  ).result;
};

const fetchAssetsAddresses = async (target, blockNumber) => {
  const assetsAddressesSignature = "0xa31091c7";
  const result = await performQuery(
    target,
    assetsAddressesSignature,
    blockNumber
  );
  const decoded = web3.eth.abi.decodeParameters(["address[]"], result);
  return decoded[0];
};

const fetchAdapterTypeId = async (target, blockNumber) => {
  const adapterInfoSignature = "0xc10e0eeb";
  const result = await performQuery(target, adapterInfoSignature, blockNumber);
  const decoded = web3.eth.abi.decodeParameter(
    { adapterInfo: { id: "address", typeId: "string", categoryId: "string" } },
    result
  );
  return decoded.typeId;
};

const fetchAssetTvlBreakdown = async (target, adapterAddress, blockNumber) => {
  const assetTvlBreakdownSignature = "0xbaac517b";
  let methodAndArgs = assetTvlBreakdownSignature + "000000000000000000000000";
  methodAndArgs += adapterAddress.substring(2);
  const result = await performQuery(target, methodAndArgs, blockNumber);
  const decoded = web3.eth.abi.decodeParameter(
    {
      assetTvlBreakdown: {
        assetId: "address",
        tokenId: "address",
        tokenPriceUsdc: "uint256",
        underlyingTokenBalance: "uint256",
        delegatedBalance: "uint256",
        adjustedBalance: "uint256",
        adjustedBalanceUsdc: "uint256",
      },
    },
    result
  );
  return decoded;
};

const getByteCode = async (contractName) =>
  await fs
    .readFileSync(`projects/yearn/bytecode/${contractName}`)
    .toString("utf8");

/*==================================================
  TVL
  ==================================================*/

async function buildBalancesForAdapter(registryAdapterAddress, block) {
  const adapterAddresses = await fetchAssetsAddresses(
    registryAdapterAddress,
    block
  );
  const adapterTypeId = await fetchAdapterTypeId(registryAdapterAddress, block);
  let totalAdapterTvl = new BigNumber(0);
  const tvlByAsset = {};
  for (const adapterAddress of adapterAddresses) {
    let tvlBreakdown;
    try {
      tvlBreakdown = await fetchAssetTvlBreakdown(
        registryAdapterAddress,
        adapterAddress,
        block
      );
    } catch (e) {
      continue;
    }

    const assetAddress = tvlBreakdown.assetId; // Not used
    const tokenAddress = tvlBreakdown.tokenId;
    const tokenPriceUsdc = tvlBreakdown.tokenPriceUsdc; // Not used
    const tokenBalance = tvlBreakdown.tokenBalance; // Not used
    const delegatedBalance = tvlBreakdown.delegatedBalance; // Not used
    const adjustedBalance = tvlBreakdown.adjustedBalance; // tokenBalance - delegatedBalance
    const assetTvl = tvlBreakdown.adjustedBalanceUsdc; // Not used
    totalAdapterTvl = totalAdapterTvl.plus(assetTvl);
    totalTvl = totalTvl.plus(assetTvl);
    const currentBalancesForAsset = balances[tokenAddress];
    if (currentBalancesForAsset) {
      balances[tokenAddress] = currentBalancesForAsset.plus(adjustedBalance);
    } else {
      balances[tokenAddress] = new BigNumber(adjustedBalance);
    }

    tvlByAsset[assetAddress] = {
      assetTvl,
      assetAddress,
    };
  }

  console.log("");
  console.log("-----------------------------");
  if (adapterTypeId === "VE_CRV") {
    console.log(`${adapterTypeId} (${adapterAddresses.length} asset)`);
  } else {
    console.log(`${adapterTypeId} (${adapterAddresses.length} assets)`);
  }
  console.log("-----------------------------");

  const sortedTvlByAsset = _.sortBy(tvlByAsset, (item) => item.assetTvl * -1);
  _.each(sortedTvlByAsset, ({ assetTvl, assetAddress }) => {
    console.log(`${assetAddress} ${formatter.format(assetTvl / 10 ** 6)}`);
  });
  console.log(
    `TVL: ${formatter.format(totalAdapterTvl.div(10 ** 6).toFixed())}`
  );

  tvlByAdapter[adapterTypeId] = {
    adapterTvl: totalAdapterTvl,
    adapterTypeId,
  };
}

async function tvl(timestamp, block) {
  for (const registryAdapterAddress of registryAdapterAddresses) {
    await buildBalancesForAdapter(registryAdapterAddress, block);
  }

  const sortedTvlByAdapter = _.sortBy(
    tvlByAdapter,
    (item) => item.adapterTvl * -1
  );
  const sortedBalances = _.sortBy(balances, (item) => item.toFixed() * -1);
  console.log("");
  console.log("=============================");
  console.log(" TVL Summary");
  console.log("=============================");
  _.each(sortedTvlByAdapter, ({ adapterTvl, adapterTypeId }) => {
    console.log(`${adapterTypeId}: ${formatter.format(adapterTvl / 10 ** 6)}`);
  });
  console.log("");
  console.log(`Total TVL ${formatter.format(totalTvl.toFixed() / 10 ** 6)}`);
  console.log("");
  totalTvl = new BigNumber(0);
  return balances;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: "yearn.finance",
  token: "YFI",
  category: "assets",
  start: 1581465600, // 02/12/2020 @ 12:00am (UTC)
  tvl,
  // contributesTo: ["Curve", "Aave"], // TODO: Determine entire list of contributions
};
