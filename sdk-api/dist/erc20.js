"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.info = exports.balanceOf = exports.symbol = exports.decimals = exports.totalSupply = void 0;
const client_1 = __importDefault(require("./client"));
const erc20_json_1 = __importDefault(require("./abi/erc20.json"));
async function balanceOf(target, owner, block, decimals) {
    const contract = new client_1.default.Contract(erc20_json_1.default, target);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    let result = (await contract.methods.balanceOf(owner).call(undefined, block));
    if (decimals) {
        result = (BigInt(result) / BigInt(10) ** BigInt(decimals)).toString();
    }
    return result;
}
exports.balanceOf = balanceOf;
async function symbol(target) {
    const contract = new client_1.default.Contract(erc20_json_1.default, target);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const result = (await contract.methods.symbol().call(undefined));
    return result;
}
exports.symbol = symbol;
async function decimals(target) {
    const contract = new client_1.default.Contract(erc20_json_1.default, target);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const result = parseInt(await contract.methods.decimals().call(undefined));
    return result;
}
exports.decimals = decimals;
async function totalSupply(target, block, decimals) {
    const contract = new client_1.default.Contract(erc20_json_1.default, target);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    let result = (await contract.methods.totalSupply().call(undefined, block));
    if (decimals) {
        result = (BigInt(result) / BigInt(10) ** BigInt(decimals)).toString();
    }
    return result;
}
exports.totalSupply = totalSupply;
async function info(target) {
    return {
        symbol: await symbol(target),
        decimals: await decimals(target),
    };
}
exports.info = info;
