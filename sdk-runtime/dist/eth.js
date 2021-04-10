"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalances = exports.getBalance = void 0;
const client_1 = __importDefault(require("./client"));
async function getBalance(target, block, decimals) {
    let result;
    if (block === undefined) {
        result = await client_1.default.getBalance(target);
    }
    else {
        result = await client_1.default.getBalance(target, block);
    }
    if (decimals) {
        result = (BigInt(result) / BigInt(10) ** BigInt(decimals)).toString();
    }
    return result;
}
exports.getBalance = getBalance;
async function getBalances(targets, block, decimals) {
    const result = await Promise.all(targets.map(async (t) => {
        return {
            target: t,
            balance: await getBalance(t, block, decimals),
        };
    }));
    return result;
}
exports.getBalances = getBalances;
