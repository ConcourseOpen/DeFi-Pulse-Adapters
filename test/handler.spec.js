const { handler } = require("../handler/handler");

describe("handler", () => {
  test("aave", async () => {
    const result = await handler({ queryStringParameters: { project: "fortube", timestamp: "0", block: "12202080" } });
    expect(result).toMatchSnapshot();
    console.log(result);
  }, 100000);
});
