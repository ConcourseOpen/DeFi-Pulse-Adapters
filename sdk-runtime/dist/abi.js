"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiCall = exports.call = void 0;
const client_1 = __importDefault(require("./client"));
const ethers_1 = require("ethers");
const client_2 = require("./client");
const erc20_json_1 = __importDefault(require("./abi/erc20.json"));
function getCachedFunction(abiString) {
    let contract;
    let functionSignature;
    let abi;
    switch (abiString) {
        case "erc20:symbol": {
            contract = new client_1.default.Contract(erc20_json_1.default);
            const abiItem = erc20_json_1.default.filter((t) => t.name === "symbol")[0];
            abi = abiItem;
            functionSignature = client_1.default.abi.encodeFunctionSignature(abiItem);
            break;
        }
        case "erc20:decimals": {
            contract = new client_1.default.Contract(erc20_json_1.default);
            const abiItem = erc20_json_1.default.filter((t) => t.name === "decimals")[0];
            abi = abiItem;
            functionSignature = client_1.default.abi.encodeFunctionSignature(abiItem);
            break;
        }
        case "erc20:balanceOf": {
            contract = new client_1.default.Contract(erc20_json_1.default);
            const abiItem = erc20_json_1.default.filter((t) => t.name === "balanceOf")[0];
            abi = abiItem;
            functionSignature = client_1.default.abi.encodeFunctionSignature(abiItem);
            break;
        }
        case "erc20:totalSupply": {
            contract = new client_1.default.Contract(erc20_json_1.default);
            const abiItem = erc20_json_1.default.filter((t) => t.name === "totalSupply")[0];
            abi = abiItem;
            functionSignature = client_1.default.abi.encodeFunctionSignature(abiItem);
            break;
        }
        default:
            throw new Error("Unknown string ABI");
    }
    return { contract, functionSignature, abi };
}
async function call(target, abi, block, params) {
    let contract;
    let functionSignature;
    if (typeof abi === "string") {
        ({ contract, functionSignature } = getCachedFunction(abi));
        contract.options.address = target;
    }
    else {
        contract = new client_1.default.Contract([abi], target);
        functionSignature = client_1.default.abi.encodeFunctionSignature(abi);
    }
    params = params !== undefined ? (Array.isArray(params) ? params : [params]) : [];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    const result = await contract.methods[functionSignature](...params).call(undefined, block);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
}
exports.call = call;
async function multiCall(abi, calls, block, target) {
    let functionFragmentAbi;
    if (typeof abi === "string") {
        ({ abi: functionFragmentAbi } = getCachedFunction(abi));
    }
    else {
        functionFragmentAbi = abi;
    }
    const templateContract = new ethers_1.ethers.Contract(calls[0]?.target ?? target ?? "", [functionFragmentAbi], client_2.multiCallProvider);
    const result = await Promise.allSettled(calls.map((call) => {
        const contract = templateContract.attach(call.target ?? target ?? "");
        const params = call.params !== undefined ? (Array.isArray(call.params) ? call.params : [call.params]) : [];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const resultPromise = contract[functionFragmentAbi.name ?? ""](...params, {
            blockTag: block,
        });
        return resultPromise;
    }));
    if (result.filter((t) => t.status === "rejected").length === result.length) {
        throw new Error("Decoding failed");
    }
    const mappedResults = calls.map((call, i) => {
        let output;
        if (result[i].status === "fulfilled") {
            if (typeof result[i].value === "number") {
                output = result[i].value;
            }
            else {
                // eslint-disable-next-line @typescript-eslint/ban-types
                output = result[i].value.toString();
            }
        }
        else {
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
exports.multiCall = multiCall;
