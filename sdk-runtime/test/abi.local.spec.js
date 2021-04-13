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

  test("multicall with bad address", async () => {
    const input = {
      block: 12202080,
      calls: [
        { target: "0x000000000000000000000000000000000000dEaD" },
        { target: "0x0000000000000000000000000000000000000000" },
        { target: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" },
        { target: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2" },
        { target: "0x0000000000085d4780B73119b644AE5ecd22b376" },
      ],
    };
    const symbolResult = await multiCall("erc20:symbol", input.calls, input.block);
    expect(symbolResult).toMatchSnapshot();
    const decimalsResult = await multiCall("erc20:decimals", input.calls, input.block);
    expect(decimalsResult).toMatchSnapshot();
  });

  test("multicall aave", async () => {
    const input = {
      calls: [
        { target: "0x6B175474E89094C44Da98b954EedeAC495271d0F" },
        { target: "0x0000000000085d4780B73119b644AE5ecd22b376" },
        { target: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
        { target: "0xdAC17F958D2ee523a2206206994597C13D831ec7" },
        { target: "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51" },
        { target: "0x80fB784B7eD66730e8b1DBd9820aFD29931aab03" },
        { target: "0x0D8775F648430679A709E98d2b0Cb6250d2887EF" },
        { target: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" },
        { target: "0x514910771AF9Ca656af840dff83E8264EcF986CA" },
        { target: "0xdd974D5C2e2928deA5F71b9825b8b646686BD200" },
        { target: "0x1985365e9f78359a9B6AD760e32412f4a445E862" },
        { target: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2" },
        { target: "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942" },
        { target: "0xE41d2489571d322189246DaFA5ebDe1F4699F498" },
        { target: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F" },
        { target: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" },
        { target: "0x4Fabb145d64652a948d72533023f6E7A623C7C53" },
        { target: "0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c" },
        { target: "0x408e41876cCCDC0F92210600ef50372656052a38" },
        { target: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e" },
        { target: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9" },
        { target: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984" },
      ],
      abi: "erc20:symbol",
      chunk: { param: "calls", length: 400, combine: "array" },
    };
    const result = await multiCall(input.abi, input.calls, input.block);
    expect(result).toMatchSnapshot();
  });

  test("multicall aave2", async () => {
    const input = {
      calls: [
        { target: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" },
        { target: "0x6B175474E89094C44Da98b954EedeAC495271d0F" },
        { target: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
        { target: "0xdAC17F958D2ee523a2206206994597C13D831ec7" },
        { target: "0x2a1530C4C41db0B0b2bB646CB5Eb1A67b7158667" },
        { target: "0x97deC872013f6B5fB443861090ad931542878126" },
        { target: "0xe9Cf7887b93150D4F2Da7dFc6D502B216438F244" },
        { target: "0xcaA7e4656f6A2B59f5f99c745F91AB26D1210DCe" },
        { target: "0x2C4Bd064b998838076fa341A83d007FC2FA50957" },
        { target: "0xF173214C720f58E03e194085B1DB28B50aCDeeaD" },
      ],
      abi: "erc20:symbol",
      chunk: { param: "calls", length: 400, combine: "array" },
    };
    const result = await multiCall(input.abi, input.calls, input.block);
    expect(result).toMatchSnapshot();
  });
});
