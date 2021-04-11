"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookupBlock = exports.tokenList = exports.kyberTokens = exports.getLogs = exports.toSymbols = void 0;
const client_1 = __importDefault(require("./client"));
const web3_utils_1 = __importDefault(require("web3-utils"));
const abi_1 = require("./abi");
const node_fetch_1 = __importDefault(require("node-fetch"));
const tokenLists_json_1 = __importDefault(require("./tokenLists.json"));
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
async function toSymbols(addresses) {
    const queryAddresses = Object.keys(addresses).filter((t) => t !== "0x0000000000000000000000000000000000000000");
    const symbols = (await abi_1.multiCall("erc20:symbol", queryAddresses
        .filter((t) => t !== "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2")
        .map((t) => {
        return { target: t };
    }))).reduce((m, t) => {
        m[t.input.target] = t.output;
        return m;
    }, {
        "0x0000000000000000000000000000000000000000": "ETH",
        "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2": "MKR",
    });
    const decimals = (await abi_1.multiCall("erc20:decimals", queryAddresses.map((t) => {
        return { target: t };
    }))).reduce((m, t) => {
        m[t.input.target] = t.output;
        return m;
    }, { "0x0000000000000000000000000000000000000000": 18 });
    const result = Object.keys(addresses).reduce((m, t) => {
        m[symbols[t]] = (BigInt(addresses[t]) / BigInt(10) ** BigInt(decimals[t])).toString();
        return m;
    }, {});
    return result;
}
exports.toSymbols = toSymbols;
async function getLogs(target, topic, keys, fromBlock, toBlock) {
    let logs = [];
    for (let i = 0; i < Math.ceil((toBlock - fromBlock) / 200000); i++) {
        const currFromBlock = fromBlock + i * 200000;
        let currToBlock = fromBlock + (i + 1) * 200000;
        currToBlock = currToBlock > toBlock ? toBlock : currToBlock;
        logs = logs.concat(await client_1.default.getPastLogs({
            fromBlock: currFromBlock,
            toBlock: currToBlock,
            address: target,
            topics: [web3_utils_1.default.sha3(topic)],
        }));
        await wait(50);
    }
    if (keys && keys.length > 0) {
        return logs.map((log) => {
            if (keys.length === 1) {
                return log[keys[0]];
            }
            else {
                const filteredLog = {};
                for (const key of keys) {
                    filteredLog[key] = log[key];
                }
                return filteredLog;
            }
        });
    }
    return logs;
}
exports.getLogs = getLogs;
async function kyberTokens() {
    const kyberMarketData = (await (await node_fetch_1.default("https://api.kyber.network/market")).json()).data;
    // TODO: add ethPrice
    const result = kyberMarketData.reduce((m, t) => {
        m[t.base_address] = { symbol: t.base_symbol, decimals: t.base_decimals };
        return m;
    }, {});
    return result;
}
exports.kyberTokens = kyberTokens;
function tokenList() {
    return tokenLists_json_1.default;
}
exports.tokenList = tokenList;
// eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
async function lookupBlock(timestamp) {
    throw new Error("Not implemented");
}
exports.lookupBlock = lookupBlock;
