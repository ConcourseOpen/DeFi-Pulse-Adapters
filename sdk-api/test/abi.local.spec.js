const { call, multiCall } = require("../dist/abi");

describe("abi", () => {
  test("call", async () => {
    const balanceOfABI = {
      constant: true,
      inputs: [
        {
          name: "_owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          name: "balance",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    };

    const result = await call(
      "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
      balanceOfABI,
      9424627,
      "0x3FfBa143f5e69Aa671C9f8e3843C88742b1FA2D9"
    );
    expect(result).toBe("3914724000000000000");
  });

  test("call with cached abi", async () => {
    const result = await call(
      "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
      "erc20:balanceOf",
      9424627,
      "0x3FfBa143f5e69Aa671C9f8e3843C88742b1FA2D9"
    );
    expect(result).toBe("3914724000000000000");
  });

  test("multicall with cached abi", async () => {
    const calls = [
      {
        target: "0x0000000000085d4780B73119b644AE5ecd22b376",
        params: "0x802275979B020F0ec871c5eC1db6e412b72fF20b",
      },
      {
        target: "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359",
        params: "0xaf38668f4719ecf9452dc0300be3f6c83cbf3721",
      },
    ];
    const result = await multiCall("erc20:balanceOf", calls, 9424627);
    expect(result).toMatchSnapshot();
  });
});
