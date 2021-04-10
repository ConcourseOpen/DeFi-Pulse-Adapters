const fetch = require("node-fetch");
const url = process.env.TVL_API_URL;

describe("remote eth api", () => {
  test("getBalance", async () => {
    const data = {
      target: "0xd5524179cB7AE012f5B642C1D6D700Bbaa76B96b",
      block: 9424627,
    };
    const expectedResult = {
      ethCallCount: 0,
      output: "2694789147548299731168",
    };
    const result = await (
      await fetch(`${url}/eth/getBalance`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    ).json();
    expect(result).toEqual(expectedResult);
  });

  test("getBalances", async () => {
    const data = {
      targets: ["0xd5524179cB7AE012f5B642C1D6D700Bbaa76B96b", "0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc"],
      block: 9424627,
    };
    const expectedResult = {
      ethCallCount: 0,
      output: [
        {
          target: "0xd5524179cB7AE012f5B642C1D6D700Bbaa76B96b",
          balance: "2694789147548299731168",
        },
        {
          target: "0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc",
          balance: "42000000000000000000",
        },
      ],
    };
    const result = await (
      await fetch(`${url}/eth/getBalances`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    ).json();
    expect(result).toEqual(expectedResult);
  });
});
