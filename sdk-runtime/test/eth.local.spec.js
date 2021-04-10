const { getBalance, getBalances } = require("../dist/eth");

describe("eth", () => {
  test("getBalance", async () => {
    const result = await getBalance("0xd5524179cB7AE012f5B642C1D6D700Bbaa76B96b", 9424627);
    expect(result).toBe("2694789147548299731168");
  });
  test("getBalances", async () => {
    const result = await getBalances(
      ["0xd5524179cB7AE012f5B642C1D6D700Bbaa76B96b", "0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc"],
      9424627
    );
    expect(result).toEqual([
      {
        target: "0xd5524179cB7AE012f5B642C1D6D700Bbaa76B96b",
        balance: "2694789147548299731168",
      },
      {
        target: "0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc",
        balance: "42000000000000000000",
      },
    ]);
  });
});
