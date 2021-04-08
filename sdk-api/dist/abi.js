"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiCall = exports.call = void 0;
const client_1 = __importDefault(require("./client"));
const web3_utils_1 = __importDefault(require("web3-utils"));
const client_2 = require("./client");
const erc20_json_1 = __importDefault(require("./abi/erc20.json"));
const multicall_1 = require("@makerdao/multicall");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isString(str) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    if (str && typeof str.valueOf() === "string") {
        return true;
    }
    return false;
}
function _flattenTypes(includeTuple, puts) {
    const types = [];
    if (puts !== undefined) {
        puts.forEach(function (param) {
            if (typeof param.components === "object") {
                if (param.type.substring(0, 5) !== "tuple") {
                    throw new Error("components found but type is not tuple");
                }
                let suffix = "";
                const arrayBracket = param.type.indexOf("[");
                if (arrayBracket >= 0) {
                    suffix = param.type.substring(arrayBracket);
                }
                const result = _flattenTypes(includeTuple, param.components);
                if (Array.isArray(result) && includeTuple) {
                    types.push("tuple(" + result.join(",") + ")" + suffix);
                }
                else if (!includeTuple) {
                    types.push("(" + result.join(",") + ")" + suffix);
                }
                else {
                    types.push(`(${result.toString()})`);
                }
            }
            else {
                types.push(param.type);
            }
        });
    }
    return types;
}
function _jsonInterfaceMethodToString(json) {
    if (!json.name) {
        throw new Error("Function name is undefined or null");
    }
    if (json.name.indexOf("(") !== -1) {
        return json.name;
    }
    return `${json.name}(${_flattenTypes(false, json.inputs).join(",")})(${_flattenTypes(false, json.outputs).join(",")})`;
}
function getCachedFunction(abiString) {
    let contract;
    let functionSignature;
    let functionString;
    switch (abiString) {
        case "erc20:symbol": {
            contract = new client_1.default.Contract(erc20_json_1.default);
            const symbolAbi = erc20_json_1.default.filter((t) => t.name === "symbol")[0];
            functionSignature = client_1.default.abi.encodeFunctionSignature(symbolAbi);
            functionString = _jsonInterfaceMethodToString(symbolAbi);
            break;
        }
        case "erc20:decimals": {
            contract = new client_1.default.Contract(erc20_json_1.default);
            const decimalsAbi = erc20_json_1.default.filter((t) => t.name === "decimals")[0];
            functionSignature = client_1.default.abi.encodeFunctionSignature(decimalsAbi);
            functionString = _jsonInterfaceMethodToString(decimalsAbi);
            break;
        }
        case "erc20:balanceOf": {
            contract = new client_1.default.Contract(erc20_json_1.default);
            const balanceOfAbi = erc20_json_1.default.filter((t) => t.name === "balanceOf")[0];
            functionSignature = client_1.default.abi.encodeFunctionSignature(balanceOfAbi);
            functionString = _jsonInterfaceMethodToString(balanceOfAbi);
            break;
        }
        case "erc20:totalSupply": {
            contract = new client_1.default.Contract(erc20_json_1.default);
            const totalSupplyAbi = erc20_json_1.default.filter((t) => t.name === "totalSupply")[0];
            functionSignature = client_1.default.abi.encodeFunctionSignature(totalSupplyAbi);
            functionString = _jsonInterfaceMethodToString(totalSupplyAbi);
            break;
        }
        default:
            throw new Error("Unknown string ABI");
    }
    return { contract, functionSignature, functionString };
}
async function call(target, abi, block, params) {
    let contract;
    let functionSignature;
    if (isString(abi)) {
        ({ contract, functionSignature } = getCachedFunction(abi));
        contract.options.address = target;
    }
    else {
        contract = new client_1.default.Contract([abi], target);
        functionSignature = client_1.default.abi.encodeFunctionSignature(abi);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    const result = await contract.methods[functionSignature](params).call(undefined, block);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
}
exports.call = call;
async function multiCall(abi, calls, block, target) {
    let functionString;
    if (isString(abi)) {
        ({ functionString } = getCachedFunction(abi));
    }
    else {
        functionString = _jsonInterfaceMethodToString(abi);
    }
    // TODO: multi output support
    const formattedCalls = calls.map((call, i) => {
        return {
            target: call.target ? call.target : target ? target : "",
            call: call.params
                ? Array.isArray(call.params)
                    ? [functionString, ...call.params]
                    : [functionString, call.params]
                : [functionString],
            returns: [[`result${i}`]],
        };
    });
    const results = (await multicall_1.aggregate(formattedCalls, { block: block ? web3_utils_1.default.toHex(block) : undefined, ...client_2.multiCallConfig })).results;
    // TODO: multi output support
    const mappedResults = calls.map((call, i) => {
        let output;
        if (typeof results.transformed[`result${i}`] === "number") {
            output = results.transformed[`result${i}`];
        }
        else {
            // eslint-disable-next-line @typescript-eslint/ban-types
            output = results.transformed[`result${i}`].toString();
        }
        return {
            input: {
                target: call.target ? call.target : target ? target : "",
                params: call.params ? (Array.isArray(call.params) ? call.params : [call.params]) : [],
            },
            success: true,
            output: output,
        };
    });
    return mappedResults;
}
exports.multiCall = multiCall;
