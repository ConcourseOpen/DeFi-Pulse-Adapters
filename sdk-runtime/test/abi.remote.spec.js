const fetch = require("node-fetch");
const url = process.env.TVL_API_URL;

describe("remote abi api", () => {
  test("call", async () => {
    const data = {
      target: "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
      params: "0x3FfBa143f5e69Aa671C9f8e3843C88742b1FA2D9",
      abi: "erc20:balanceOf",
      block: 9424627,
    };
    const expectedResult = {
      ethCallCount: 0,
      output: "3914724000000000000",
    };
    const result = await (
      await fetch(`${url}/abi/call`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    ).json();
    expect(result).toEqual(expectedResult);
  });

  test("multiCall", async () => {
    const data = {
      calls: [
        {
          target: "0x0000000000085d4780B73119b644AE5ecd22b376",
          params: "0x802275979B020F0ec871c5eC1db6e412b72fF20b",
        },
        {
          target: "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359",
          params: "0xaf38668f4719ecf9452dc0300be3f6c83cbf3721",
        },
      ],
      abi: "erc20:balanceOf",
      block: 9424627,
    };
    const expectedResult = {
      ethCallCount: 0,
      output: [
        {
          input: {
            target: "0x0000000000085d4780B73119b644AE5ecd22b376",
            params: ["0x802275979B020F0ec871c5eC1db6e412b72fF20b"],
          },
          success: true,
          output: "9075930471597257944363",
        },
        {
          input: {
            target: "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359",
            params: ["0xaf38668f4719ecf9452dc0300be3f6c83cbf3721"],
          },
          success: true,
          output: "14182595309792052635843",
        },
      ],
    };
    const result = await (
      await fetch(`${url}/abi/multiCall`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    ).json();
    expect(result).toEqual(expectedResult);
  });
});
