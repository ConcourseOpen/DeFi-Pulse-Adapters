import Eth from "web3-eth";
import { providers } from "@0xsequence/multicall";
import { providers as ethersProviders } from "ethers";
import dotenv from "dotenv";

dotenv.config();
if (process.env.ETH_ENDPOINT_URL === undefined) {
  throw new Error("Cannot find ETH_ENDPOINT_URL in env vars");
}
if (process.env.MULTICALL_CONTRACT_ADDRESS === undefined) {
  throw new Error("Cannot find MULTICALL_CONTRACT_ADDRESS in env vars");
}

const eth = new Eth(process.env.ETH_ENDPOINT_URL);
const multiCallProvider = new providers.MulticallProvider(
  new ethersProviders.JsonRpcProvider(process.env.ETH_ENDPOINT_URL),
  {
    batchSize: 500,
    verbose: true,
    contract: process.env.MULTICALL_CONTRACT_ADDRESS,
  }
);

export default eth;
export { multiCallProvider };
