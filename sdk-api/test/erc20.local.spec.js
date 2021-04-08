const { symbol, decimals, totalSupply, balanceOf } = require("../dist/erc20");

describe("erc20", () => {
  test("symbol", async () => {
    const result = await symbol("0x6B175474E89094C44Da98b954EedeAC495271d0F");
    expect(result).toBe("DAI");
  });
  test("decimals", async () => {
    const result = await decimals("0x6B175474E89094C44Da98b954EedeAC495271d0F");
    expect(result).toBe(18);
  });
  test("totalSupply", async () => {
    const result = await totalSupply("0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", 9424366);
    expect(result).toBe("62681748267");
  });
  test("totalSupply without blocks", async () => {
    const result = await totalSupply("0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599");
    expect(result);
  });
  test("balanceOf", async () => {
    const result = await balanceOf(
      "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
      "0x3FfBa143f5e69Aa671C9f8e3843C88742b1FA2D9",
      9424627
    );
    expect(result).toBe("3914724000000000000");
  });
});
