const { readdir } = require("fs").promises;
const { join } = require("path");
const sdk = require("../sdk/");

exports.handler = async (event) => {
  if (
    !event.queryStringParameters ||
    !event.queryStringParameters.project ||
    !event.queryStringParameters.block ||
    !event.queryStringParameters.timestamp
  ) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "missing query parameter" }),
    };
  }
  if (!(await readdir("projects")).some((t) => t === event.queryStringParameters.project)) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "unknown project" }),
    };
  }
  if (isNaN(parseInt(event.queryStringParameters.block))) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "block is not a number" }),
    };
  }
  if (isNaN(parseInt(event.queryStringParameters.timestamp))) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "timestamp is not a number" }),
    };
  }
  const project = require(join("..", "projects", event.queryStringParameters.project, "index.js"));
  const output = await project.tvl(
    parseInt(event.queryStringParameters.timestamp),
    parseInt(event.queryStringParameters.block)
  );
  const formattedOutput = (await sdk.api.util.toSymbols(output)).output;
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formattedOutput),
  };
};
