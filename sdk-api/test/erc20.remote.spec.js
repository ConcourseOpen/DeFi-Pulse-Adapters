const fetch = require("node-fetch");
const url = process.env.TVL_API_URL;

describe("remote erc20 api", () => {
  test("symbol", async () => {
    const data = {
      target: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    };
    const expectedResult = {
      ethCallCount: 0,
      output: "DAI",
    };
    const result = await (
      await fetch(`${url}/erc20/symbol`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    ).json();
    expect(result).toEqual(expectedResult);
  });

  test("decimals", async () => {
    const data = {
      target: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    };
    const expectedResult = {
      ethCallCount: 0,
      output: 18,
    };
    const result = await (
      await fetch(`${url}/erc20/decimals`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    ).json();
    expect(result).toEqual(expectedResult);
  });

  test("info", async () => {
    const data = {
      target: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    };
    const expectedResult = {
      ethCallCount: 0,
      output: {
        symbol: "DAI",
        decimals: 18,
      },
    };
    const result = await (
      await fetch(`${url}/erc20/info`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    ).json();
    expect(result).toEqual(expectedResult);
  });

  test("totalSupply", async () => {
    const data = {
      target: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      block: 9424366,
    };
    const expectedResult = {
      ethCallCount: 0,
      output: "62681748267",
    };
    const result = await (
      await fetch(`${url}/erc20/totalSupply`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    ).json();
    expect(result).toEqual(expectedResult);
  });

  test("balanceOf", async () => {
    const data = {
      target: "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
      owner: "0x3FfBa143f5e69Aa671C9f8e3843C88742b1FA2D9",
      block: 9424627,
    };
    const expectedResult = {
      ethCallCount: 0,
      output: "3914724000000000000",
    };
    const result = await (
      await fetch(`${url}/erc20/balanceOf`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    ).json();
    expect(result).toEqual(expectedResult);
  });
});
