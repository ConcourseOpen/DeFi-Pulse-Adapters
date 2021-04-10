const { toSymbols, getLogs, kyberTokens } = require("../dist/util");

describe("util", () => {
  test("toSymbols", async () => {
    const result = await toSymbols({
      "0x0000000000000000000000000000000000000000": "1000000000000000000", // ETH
      "0x6B175474E89094C44Da98b954EedeAC495271d0F": "2000000000000000000", // DAI
    });
    expect(result).toEqual({
      ETH: "1",
      DAI: "2",
    });
  });

  test("getLogs", async () => {
    const result = await getLogs(
      "0x9424B1412450D0f8Fc2255FAf6046b98213B76Bd",
      "LOG_NEW_POOL(address,address)",
      [],
      9562480,
      10411347
    );
    expect(result.slice(0, 3)).toMatchSnapshot();
  });

  test("getLogs with large block range", async () => {
    const input = {
      keys: [],
      toBlock: 12202080,
      target: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
      fromBlock: 10000835,
      topic: "PairCreated(address,address,address,uint256)",
    };
    await getLogs(input.target, input.topic, input.keys, input.fromBlock, input.toBlock);
  }, 100000);

  test("getLogs with keys", async () => {
    const expectedResult = [
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
    ];
    const result = await getLogs(
      "0x9424B1412450D0f8Fc2255FAf6046b98213B76Bd",
      "LOG_NEW_POOL(address,address)",
      ["topics"],
      9562480,
      10411347
    );
    expect(result.slice(0, 3)).toEqual(expectedResult);
  });

  test("kyberTokens", async () => {
    const result = await kyberTokens();
    expect(result).toMatchSnapshot();
  });
});
