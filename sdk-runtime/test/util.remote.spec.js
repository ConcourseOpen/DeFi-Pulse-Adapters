const fetch = require("node-fetch");
const url = process.env.TVL_API_URL;

describe("remote util api", () => {
  test("toSymbols", async () => {
    const data = {
      data: {
        "0x0000000000000000000000000000000000000000": "1000000000000000000", // ETH
        "0x6B175474E89094C44Da98b954EedeAC495271d0F": "2000000000000000000", // DAI
      },
    };
    const expectedResult = {
      ethCallCount: 0,
      output: {
        ETH: "1",
        DAI: "2",
      },
    };
    const result = await (
      await fetch(`${url}/util/toSymbols`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    ).json();
    expect(result).toEqual(expectedResult);
  });

  test("getLogs", async () => {
    const data = {
      target: "0x9424B1412450D0f8Fc2255FAf6046b98213B76Bd",
      topic: "LOG_NEW_POOL(address,address)",
      keys: ["topics"],
      fromBlock: 9562480,
      toBlock: 10411347,
    };
    const expectedResult = {
      ethCallCount: 0,
      output: [
        [
          "0x8ccec77b0cb63ac2cafd0f5de8cdfadab91ce656d262240ba8a6343bccc5f945",
          "0x00000000000000000000000018fa2ac3c88112e36eff15370346f9aff3161fd1",
          "0x000000000000000000000000165a50bc092f6870dc111c349bae5fc35147ac86",
        ],
        [
          "0x8ccec77b0cb63ac2cafd0f5de8cdfadab91ce656d262240ba8a6343bccc5f945",
          "0x00000000000000000000000018fa2ac3c88112e36eff15370346f9aff3161fd1",
          "0x00000000000000000000000057755f7dec33320bca83159c26e93751bfd30fbe",
        ],
        [
          "0x8ccec77b0cb63ac2cafd0f5de8cdfadab91ce656d262240ba8a6343bccc5f945",
          "0x00000000000000000000000018fa2ac3c88112e36eff15370346f9aff3161fd1",
          "0x000000000000000000000000e5d1fab0c5596ef846dcc0958d6d0b20e1ec4498",
        ],
      ],
    };
    const result = await (
      await fetch(`${url}/util/getLogs`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    ).json();
    expect(result.output.slice(0, 3)).toEqual(expectedResult.output.slice(0, 3));
  });

  test("kyberTokens", async () => {
    const data = {};
    const result = await (
      await fetch(`${url}/util/kyberTokens`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    ).json();
    expect(result).toMatchSnapshot();
  });
});
