import eth from "./client";
import erc20 from "./abi/erc20.json";

type FlattenIfArray<T> = T extends (infer R)[] ? R : T;
type AbiItem = FlattenIfArray<ConstructorParameters<typeof eth.Contract>[0]>;

async function balanceOf(target: string, owner: string, block?: number, decimals?: number) {
  const contract = new eth.Contract(erc20 as AbiItem[], target);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  let result = (await contract.methods.balanceOf(owner).call(undefined, block)) as string;
  if (decimals) {
    result = (BigInt(result) / BigInt(10) ** BigInt(decimals)).toString();
  }
  return result;
}

async function symbol(target: string) {
  const contract = new eth.Contract(erc20 as AbiItem[], target);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const result = (await contract.methods.symbol().call(undefined)) as string;
  return result;
}

async function decimals(target: string) {
  const contract = new eth.Contract(erc20 as AbiItem[], target);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const result = parseInt(await contract.methods.decimals().call(undefined));
  return result;
}

async function totalSupply(target: string, block?: number, decimals?: number) {
  const contract = new eth.Contract(erc20 as AbiItem[], target);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  let result = (await contract.methods.totalSupply().call(undefined, block)) as string;
  if (decimals) {
    result = (BigInt(result) / BigInt(10) ** BigInt(decimals)).toString();
  }
  return result;
}

async function info(target: string) {
  return {
    symbol: await symbol(target),
    decimals: await decimals(target),
  };
}

export { totalSupply, decimals, symbol, balanceOf, info };
