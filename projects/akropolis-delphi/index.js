const sdk = require("../../sdk");
const abi = require("./abi.json");

const akroStakingPool = "0x3501Ec11d205fa249f2C42f5470e137b529b35D0";
const adelStakingPool = "0x1A547c3dd03c39Fb2b5aEaFC524033879bD28F13";

const akroTokenAddress = "0x8ab7404063ec4dbcfd4598215992dc3f8ec853d7";
const adelTokenAddress = "0x94d863173EE77439E4292284fF13fAD54b3BA182";

const akroStartBlock = 10644388;
const adelStartBlock = 10794244;

async function getTotalStaked(address, block, startBlock) {
  return block > startBlock
    ? (
        await sdk.api.abi.call({
          block,
          target: address,
          params: [],
          abi: abi["totalStaked"],
        })
      ).output
    : 0;
}

async function tvl(timestamp, block) {
  return {
    [akroTokenAddress]: await getTotalStaked(
      akroStakingPool,
      block,
      akroStartBlock
    ),
    [adelTokenAddress]: await getTotalStaked(
      adelStakingPool,
      block,
      adelStartBlock
    ),
  };
}

module.exports = {
  name: "Akropolis Delphi",
  token: "ADEL",
  category: "assets",
  start: 1597225618, // Wed, 12 Aug 2020 09:46:58 GMT
  tvl,
};
