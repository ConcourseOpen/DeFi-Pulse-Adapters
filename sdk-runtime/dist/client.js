"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiCallConfig = void 0;
const web3_eth_1 = __importDefault(require("web3-eth"));
const eth = new web3_eth_1.default(process.env.ETH_ENDPOINT_URL);
const multiCallConfig = {
    multicallAddress: "0xeefba1e63905ef1d7acba5a8513c70307c1ce441",
    rpcUrl: process.env.ETH_ENDPOINT_URL,
};
exports.multiCallConfig = multiCallConfig;
exports.default = eth;
