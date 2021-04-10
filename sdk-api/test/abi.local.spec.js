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

  test("call with no input", async () => {
    const input = {
      target: "0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3",
      abi: {
        constant: true,
        inputs: [],
        name: "getReserves",
        outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      block: 12202080,
    };

    const result = await call(input.target, input.abi, input.block);
    expect(result).toMatchSnapshot();
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

  test("multicall with number params", async () => {
    const input = {
      block: 12202080,
      calls: [
        { target: "0xE48BC2Ba0F2d2E140382d8B5C8f261a3d35Ed09C", params: 0 },
        { target: "0xE48BC2Ba0F2d2E140382d8B5C8f261a3d35Ed09C", params: 1 },
        { target: "0xE48BC2Ba0F2d2E140382d8B5C8f261a3d35Ed09C", params: 2 },
        { target: "0xE48BC2Ba0F2d2E140382d8B5C8f261a3d35Ed09C", params: 3 },
        { target: "0xE48BC2Ba0F2d2E140382d8B5C8f261a3d35Ed09C", params: 4 },
        { target: "0xE48BC2Ba0F2d2E140382d8B5C8f261a3d35Ed09C", params: 5 },
        { target: "0xE48BC2Ba0F2d2E140382d8B5C8f261a3d35Ed09C", params: 6 },
        { target: "0xE48BC2Ba0F2d2E140382d8B5C8f261a3d35Ed09C", params: 7 },
        { target: "0xE48BC2Ba0F2d2E140382d8B5C8f261a3d35Ed09C", params: 8 },
        { target: "0xE48BC2Ba0F2d2E140382d8B5C8f261a3d35Ed09C", params: 9 },
      ],
      abi: {
        constant: true,
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "collateralTokens",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      chunk: { param: "calls", length: 5000, combine: "array" },
    };
    const result = await multiCall(input.abi, input.calls, input.block);
    expect(result).toMatchSnapshot();
  });
});
