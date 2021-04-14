import eth from "./client";

async function getBalance(target: string, block?: number, decimals?: number) {
  let result: string;
  if (block === undefined) {
    result = await eth.getBalance(target);
  } else {
    result = await eth.getBalance(target, block);
  }
  if (decimals) {
    result = (BigInt(result) / BigInt(10) ** BigInt(decimals)).toString();
  }
  return result;
}

async function getBalances(targets: string[], block?: number, decimals?: number) {
  const result = await Promise.all(
    targets.map(async (t) => {
      return {
        target: t,
        balance: await getBalance(t, block, decimals),
      };
    })
  );
  return result;
}

export { getBalance, getBalances };
