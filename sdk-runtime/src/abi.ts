import eth from "./client";
import utils from "web3-utils";
import { ethers } from "ethers";
import { FunctionFragment } from "@ethersproject/abi";
import { multiCallProvider } from "./client";
import erc20 from "./abi/erc20.json";

type FlattenIfArray<T> = T extends (infer R)[] ? R : T;
type AbiItem = FlattenIfArray<ConstructorParameters<typeof eth.Contract>[0]>;
type Contract = InstanceType<typeof eth.Contract>;

function getCachedFunction(abiString: string) {
  let contract: Contract;
  let functionSignature: string;
  let abi: FunctionFragment;
  switch (abiString) {
    case "erc20:symbol": {
      contract = new eth.Contract(erc20 as AbiItem[]);
      const abiItem = erc20.filter((t) => t.name === "symbol")[0] as AbiItem;
      abi = abiItem as FunctionFragment;
      functionSignature = eth.abi.encodeFunctionSignature(abiItem);
      break;
    }
    case "erc20:decimals": {
      contract = new eth.Contract(erc20 as AbiItem[]);
      const abiItem = erc20.filter((t) => t.name === "decimals")[0] as AbiItem;
      abi = abiItem as FunctionFragment;
      functionSignature = eth.abi.encodeFunctionSignature(abiItem);
      break;
    }
    case "erc20:balanceOf": {
      contract = new eth.Contract(erc20 as AbiItem[]);
      const abiItem = erc20.filter((t) => t.name === "balanceOf")[0] as AbiItem;
      abi = abiItem as FunctionFragment;
      functionSignature = eth.abi.encodeFunctionSignature(abiItem);
      break;
    }
    case "erc20:totalSupply": {
      contract = new eth.Contract(erc20 as AbiItem[]);
      const abiItem = erc20.filter((t) => t.name === "totalSupply")[0] as AbiItem;
      abi = abiItem as FunctionFragment;
      functionSignature = eth.abi.encodeFunctionSignature(abiItem);
      break;
    }
    default:
      throw new Error("Unknown string ABI");
  }
  return { contract, functionSignature, abi };
}

async function call(
  target: string,
  abi: AbiItem | string,
  block?: number,
  params?: string | number | (string | number)[]
) {
  let contract: Contract;
  let functionSignature: string;
  if (typeof abi === "string") {
    ({ contract, functionSignature } = getCachedFunction(abi));
    contract.options.address = target;
  } else {
    contract = new eth.Contract([abi], target);
    functionSignature = eth.abi.encodeFunctionSignature(abi);
  }
  params = params !== undefined ? (Array.isArray(params) ? params : [params]) : [];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const result = await contract.methods[functionSignature](...params).call(undefined, block);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return result;
}

async function multiCall(
  abi: FunctionFragment | string,
  calls: { params?: string | number | (string | number)[]; target?: string }[],
  block?: number,
  target?: string
) {
  let functionFragmentAbi: FunctionFragment;
  if (typeof abi === "string") {
    ({ abi: functionFragmentAbi } = getCachedFunction(abi));
  } else {
    functionFragmentAbi = abi;
  }
  if (calls.length === 0) return [];
  const templateContract = new ethers.Contract(
    calls[0]?.target ?? target ?? "",
    [functionFragmentAbi],
    multiCallProvider
  );
  const result = await Promise.allSettled(
    calls.map((call) => {
      const contract = templateContract.attach(call.target ?? target ?? "");
      const params = call.params !== undefined ? (Array.isArray(call.params) ? call.params : [call.params]) : [];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const resultPromise = contract[functionFragmentAbi.name ?? ""](...params, {
        blockTag: block,
      }) as Promise<unknown>;
      return resultPromise;
    })
  );
  if (result.filter((t) => t.status === "rejected").length === result.length) {
    throw new Error("Decoding failed");
  }
  const mappedResults = calls.map((call, i) => {
    let output;
    if (result[i].status === "fulfilled") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (utils.isBigNumber((result[i] as PromiseFulfilledResult<any>).value)) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        output = ((result[i] as PromiseFulfilledResult<unknown>).value as object).toString();
      } else {
        output = (result[i] as PromiseFulfilledResult<unknown>).value;
      }
    } else {
      output = undefined;
    }
    return {
      input: {
        target: call.target ? call.target : target ? target : "",
        params: call.params ? (Array.isArray(call.params) ? call.params : [call.params]) : [],
      },
      success: result[i].status === "fulfilled",
      output: output,
    };
  });
  return mappedResults;
}

export { call, multiCall };
