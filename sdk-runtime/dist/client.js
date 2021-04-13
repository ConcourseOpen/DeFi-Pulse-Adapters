"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiCallProvider = void 0;
const web3_eth_1 = __importDefault(require("web3-eth"));
const multicall_1 = require("@0xsequence/multicall");
const ethers_1 = require("ethers");
const eth = new web3_eth_1.default(process.env.ETH_ENDPOINT_URL);
const multiCallProvider = new multicall_1.providers.MulticallProvider(
  new ethers_1.providers.JsonRpcProvider(process.env.ETH_ENDPOINT_URL)
);
exports.multiCallProvider = multiCallProvider;
exports.default = eth;
