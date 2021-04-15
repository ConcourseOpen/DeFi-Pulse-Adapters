const express = require("express");
const { readdir } = require("fs").promises;
const { join } = require("path");
const { toSymbols } = require("./sdk/lib/address");

const app = express();
const port = 7890;

async function hasProject(project) {
  const projectNames = await readdir("projects");

  return projectNames.some(name => name === project);
}

app.get("/projects/:project", async (req, res) => {
  const project = req.params.project;

  if (!(await hasProject(project))) {
    res.status(400).json(JSON.stringify({ error: `unknown project ${project}` }));

    return;
  }

  const { tvl } = require(`./projects/${project}/index.js`);

  const output = await tvl(0, 9999999999);

  const outputWithSymbolKeys = toSymbols(output);

  console.log("Final Result", output, outputWithSymbolKeys);

  res.json(JSON.stringify(outputWithSymbolKeys));
});

app.listen(port, () => {
  console.log(`TVL Server listening at http://localhost:${port}`);
});
