import eth from "./client";
import utils from "web3-utils";
import { multiCall } from "./abi";
import fetch from "node-fetch";

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
type LogArray = ThenArg<ReturnType<typeof eth.getPastLogs>>;

export interface KyberMarket {
  data: KyberMarketDataEntity[];
  error: boolean;
}
export interface KyberMarketDataEntity {
  timestamp: number;
  quote_symbol: string;
  quote_name: string;
  quote_decimals: number;
  quote_address: string;
  base_symbol: string;
  base_name: string;
  base_decimals: number;
  base_address: string;
  past_24h_high: number;
  past_24h_low: number;
  usd_24h_volume: number;
  eth_24h_volume: number;
  token_24h_volume: number;
  current_bid: number;
  current_ask: number;
  last_traded: number;
  pair: string;
  custom_proxy?: boolean | null;
  original_token?: string | null;
}

const wait = (milliseconds: number) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

async function toSymbols(addresses: Record<string, string>) {
  const queryAddresses = Object.keys(addresses).filter((t) => t !== "0x0000000000000000000000000000000000000000");
  const symbols = (
    await multiCall(
      "erc20:symbol",
      queryAddresses
        .filter((t) => t !== "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2")
        .map((t) => {
          return { target: t };
        })
    )
  ).reduce(
    (m, t) => {
      m[t.input.target] = t.output as string;
      return m;
    },
    {
      "0x0000000000000000000000000000000000000000": "ETH",
      "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2": "MKR",
    } as Record<string, string>
  );
  const decimals = (
    await multiCall(
      "erc20:decimals",
      queryAddresses.map((t) => {
        return { target: t };
      })
    )
  ).reduce(
    (m, t) => {
      m[t.input.target] = t.output as number;
      return m;
    },
    { "0x0000000000000000000000000000000000000000": 18 } as Record<string, number>
  );

  const result = Object.keys(addresses).reduce((m, t) => {
    m[symbols[t]] = (BigInt(addresses[t]) / BigInt(10) ** BigInt(decimals[t])).toString();
    return m;
  }, {} as Record<string, string>);
  return result;
}

async function getLogs(target: string, topic: string, keys: string[], fromBlock: number, toBlock: number) {
  let logs: LogArray = [];
  for (let i = 0; i < Math.ceil((toBlock - fromBlock) / 200000); i++) {
    const currFromBlock = fromBlock + i * 200000;
    let currToBlock = fromBlock + (i + 1) * 200000;
    currToBlock = currToBlock > toBlock ? toBlock : currToBlock;
    logs = logs.concat(
      await eth.getPastLogs({
        fromBlock: currFromBlock,
        toBlock: currToBlock,
        address: target,
        topics: [utils.sha3(topic)],
      })
    );
    await wait(50);
  }
  if (keys && keys.length > 0) {
    return logs.map((log) => {
      if (keys.length === 1) {
        return log[keys[0] as keyof typeof log];
      } else {
        const filteredLog: Record<string, unknown> = {};
        for (const key of keys) {
          filteredLog[key] = log[key as keyof typeof log];
        }
        return filteredLog;
      }
    });
  }
  return logs;
}

async function kyberTokens() {
  const kyberMarketData = ((await (await fetch("https://api.kyber.network/market")).json()) as KyberMarket).data;
  // TODO: add ethPrice
  const result = kyberMarketData.reduce((m, t) => {
    m[t.base_address] = { symbol: t.base_symbol, decimals: t.base_decimals };
    return m;
  }, {} as Record<string, { symbol: string; decimals: number }>);
  return result;
}

// eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
async function lookupBlock(timestamp: number) {
  throw new Error("Not implemented");
}

export { toSymbols, getLogs, kyberTokens, lookupBlock };
